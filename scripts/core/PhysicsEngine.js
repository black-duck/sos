PHYSICS_LOOP_HZ = 1/60.0;

Vec2 = Box2D.Common.Math.b2Vec2;
BodyDef =  Box2D.Dynamics.b2BodyDef;
Body =  Box2D.Dynamics.b2Body;
FixtureDef =  Box2D.Dynamics.b2FixtureDef;
Fixture =  Box2D.Dynamics.b2Fixture;
World =  Box2D.Dynamics.b2World;
MassData = Box2D.Collision.Shapes.b2MassData;
PolygonShape =  Box2D.Collision.Shapes.b2PolygonShape;
CircleShape = Box2D.Collision.Shapes.b2CircleShape;
DebugDraw =  Box2D.Dynamics.b2DebugDraw;
RevoluteJointDef =  Box2D.Dynamics.Joints.b2RevoluteJointDef;


PhysicsEngine = {
  
	world: null,
	
	groups: {}, //collision groups
	__groupsOffset: 0,

	init: function () {

		//DRAFT - better solution needed
		Box2D.Common.b2Settings.b2_maxTranslation = 20.0;
		Box2D.Common.b2Settings.b2_maxTranslationSquared = 20.0 * 20.0;

		this.world = new World(
    		new Vec2(-4, 0), //everything is moving backwords  						
    		true ); //don't allow sleep
		
		this.addGroup('allies');
		this.addGroup('enemies');
		this.addGroup('env');
		

	},

	addGroup: function (name) {
		var MAX_GROUPS = 16;
		
		this.groups[name] = (0x01 << this.__groupsOffset);
		this.__groupsOffset++;
	},

	addContactListener: function (callbacks) {

    	var listener = new Box2D.Dynamics.b2ContactListener;
    	
		if (callbacks.BeginContact) listener.BeginContact = function (contact) {
      		callbacks.BeginContact(contact.GetFixtureA().GetBody(), 
									contact.GetFixtureB().GetBody());
    	}

    	if (callbacks.EndContact) listener.EndContact = function (contact) {
      		callbacks.EndContact(contact.GetFixtureA().GetBody(), 
								contact.GetFixtureB().GetBody());
    	}
    
		if (callbacks.PostSolve) listener.PostSolve = function (contact, impulse) {
      		callbacks.PostSolve(contact.GetFixtureA().GetBody(), 
								contact.GetFixtureB().GetBody(), 
								impulse.normalImpulses[0]);
    	}

    	this.world.SetContactListener(listener);
  	},

	update: function () {
 		
		var start = Date.now();
    	this.world.Step(
    				PHYSICS_LOOP_HZ, //frame-rate
    				5, //velocity iterations
    				6); //position iterations
    
		//this.world.ClearForces();
    	return (Date.now() - start);
	},

	registerBody: function (bodyDef) {
    	var body = this.world.CreateBody(bodyDef);
    	return body;
	},

	addBody: function (entityDef) {
 
		var bodyDef = new BodyDef;

    	var id = entityDef.id;

    	if (entityDef.type == 'static') {
			bodyDef.type = Body.b2_staticBody;
    	} 
		else if (entityDef.type == 'kinematic') {
			bodyDef.type = Body.b2_kinematicBody;
		}
		else {
      		bodyDef.type = Body.b2_dynamicBody;
    	}

    	bodyDef.position.x = entityDef.x;
    	bodyDef.position.y = entityDef.y;
    
		if (entityDef.userData !== undefined) bodyDef.userData = entityDef.userData;
    	if (entityDef.angle !== undefined) bodyDef.angle = entityDef.angle;
    	if (entityDef.damping !== undefined) bodyDef.linearDamping = entityDef.damping;
    	if (entityDef.bullet) bodyDef.bullet = true;	

		var body = this.registerBody(bodyDef);
		var fixtureDefinition = new FixtureDef;
		

		if (entityDef.groups && entityDef.groups.length) {
			fixtureDefinition.filter.categoryBits = 0x0000;
			for (var i = 0; i < entityDef.groups.length; i++) {
				fixtureDefinition.filter.categoryBits |= this.groups[entityDef.groups[i]];
			}			
		}
		else {
			fixtureDefinition.filter.categoryBits = 0x0001;
		}

		if (entityDef.collidesWith && entityDef.collidesWith.length) {
			fixtureDefinition.filter.maskBits = 0x0000;
			for (var i = 0; i < entityDef.collidesWith.length; i++) {
				fixtureDefinition.filter.maskBits |= this.groups[entityDef.collidesWith[i]];
			}
		}
		else {
			fixtureDefinition.filter.maskBits = 0xFFFF;
		}
		
		if (entityDef.ignore && entityDef.ignore.length) {
			for (var i = 0; i < entityDef.ignore.length; i++) {
				fixtureDefinition.filter.maskBits &= ~this.groups[entityDef.ignore[i]];
			}
			console.log(fixtureDefinition.filter.maskBits);

		}
		
		if (entityDef.density !== undefined) bodyDef.density = entityDef.density;
		else	fixtureDefinition.density = 1.0;

		if (entityDef.friction !== undefined) bodyDef.friction = entityDef.friction;
		else	fixtureDefinition.friction = 1; 

		if (entityDef.restitution !== undefined) bodyDef.restitution = entityDef.restitution;
		else	fixtureDefinition.restitution = 1; 


		fixtureDefinition.shape = new PolygonShape;
		fixtureDefinition.shape.SetAsBox(entityDef.halfWidth, entityDef.halfHeight);
		
		body.CreateFixture(fixtureDefinition);

		return body;

	},

	removeBodyAsObj: function (obj) {

		this.world.DestroyBody(obj);
	},
  
	setVelocity: function (bodyId, x, y) {
    	var body = this.bodiesMap[bodyId];
    	body.SetLinearVelocity(new Vec2(x, y));
	},

	getVelocity: function (body) {
    	return body.GetLinearVelocity();
	},

	getPosition: function (body) {
    	return body.GetPosition();
	},

	setPosition: function (body, pos) {
    	body.SetPosition(pos);
  	},

};

