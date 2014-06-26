// Mover
// A moving platform
// This platform moves between a start and end point in a direction specified by the axis.
// Requires:
//   - Two child entities called "Start" and "End" which define the positions (only in one axis) of where to move the platform between

pc.script.attribute("speed", "number", 1);
pc.script.attribute("axis", "string", "x");

pc.script.create('mover', function (context) {
    // temp vector to use for maths. This prevents allocating new vectors at runtime
    var temp = new pc.Vec3();

    // Creates a new mover instance
    var Mover = function (entity) {
        this.entity = entity;

        this.speed = 1;

        // start and end entities
        this.start = null;
        this.end = null;

        // If forwards is true move from start to end, else move from end to start.
        this.forwards = true;
    };

    Mover.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            // Get the start and end Entites
            this.start = this.entity.findByName("Start");
            this.end = this.entity.findByName("End");

            // Save the original start position of the platform, for working out relative start/end points and for resetting 
            this.origin = new pc.Vec3().copy(this.entity.getPosition());

            // Initialize the velocity to forward speed on the defined axis
            var v = this.entity.rigidbody.linearVelocity;
            v[this.axis] = this.speed;
            this.entity.rigidbody.linearVelocity = v;
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            var pos = this.entity.getPosition();
            var localPos = this.entity.getLocalPosition();
            var start = this.start.getLocalPosition();
            var end = this.end.getLocalPosition();
            var v;

            // Check to see if platform has moved passed the end position, if so, reverse it's velocity
            if (this.forwards && pos[this.axis] > temp.copy(end).add(this.origin)[this.axis]) {
                this.forwards = false;
                v = this.entity.rigidbody.linearVelocity;
                v[this.axis] = -this.speed;
                this.entity.rigidbody.linearVelocity = v;
            }

            // Check to see if platform has moved passed the start position, if so, reverse it's velocity
            if (!this.forwards && pos[this.axis] < temp.copy(start).add(this.origin)[this.axis]) {
                this.forwards = true;
                v = this.entity.rigidbody.linearVelocity;
                v[this.axis] = this.speed;
                this.entity.rigidbody.linearVelocity = v;
            }
        },

        // reset back to original status     
        reset: function () {
            this.entity.setPosition(this.origin);
            this.entity.rigidbody.syncEntityToBody();

            var v = this.entity.rigidbody.linearVelocity;
            v[this.axis] = this.speed;
            this.entity.rigidbody.linearVelocity = v;

            this.forwards = true;
        }
    };

    return Mover;
});

// Long, isn't it? lol

// Mover
// A moving platform
// This platform moves between a start and end point in a direction specified by the axis.
// Requires:
//   - Two child entities called "Start" and "End" which define the positions (only in one axis) of where to move the platform between

pc.script.attribute("speed", "number", 1);
pc.script.attribute("axis", "string", "x");

pc.script.create('mover', function (context) {
    // temp vector to use for maths. This prevents allocating new vectors at runtime
    var temp = new pc.Vec3();

    // Creates a new mover instance
    var Mover = function (entity) {
        this.entity = entity;

        this.speed = 1;

        // start and end entities
        this.start = null;
        this.end = null;

        // If forwards is true move from start to end, else move from end to start.
        this.forwards = true;
    };

    Mover.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            // Get the start and end Entites
            this.start = this.entity.findByName("Start");
            this.end = this.entity.findByName("End");

            // Save the original start position of the platform, for working out relative start/end points and for resetting 
            this.origin = new pc.Vec3().copy(this.entity.getPosition());

            // Initialize the velocity to forward speed on the defined axis
            var v = this.entity.rigidbody.linearVelocity;
            v[this.axis] = this.speed;
            this.entity.rigidbody.linearVelocity = v;
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            var pos = this.entity.getPosition();
            var localPos = this.entity.getLocalPosition();
            var start = this.start.getLocalPosition();
            var end = this.end.getLocalPosition();
            var v;

            // Check to see if platform has moved passed the end position, if so, reverse it's velocity
            if (this.forwards && pos[this.axis] > temp.copy(end).add(this.origin)[this.axis]) {
                this.forwards = false;
                v = this.entity.rigidbody.linearVelocity;
                v[this.axis] = -this.speed;
                this.entity.rigidbody.linearVelocity = v;
            }

            // Check to see if platform has moved passed the start position, if so, reverse it's velocity
            if (!this.forwards && pos[this.axis] < temp.copy(start).add(this.origin)[this.axis]) {
                this.forwards = true;
                v = this.entity.rigidbody.linearVelocity;
                v[this.axis] = this.speed;
                this.entity.rigidbody.linearVelocity = v;
            }
        },

        // reset back to original status     
        reset: function () {
            this.entity.setPosition(this.origin);
            this.entity.rigidbody.syncEntityToBody();

            var v = this.entity.rigidbody.linearVelocity;
            v[this.axis] = this.speed;
            this.entity.rigidbody.linearVelocity = v;

            this.forwards = true;
        }
    };

    return Mover;
});

// Very dodgy.

pc.script.create('kill_trigger', function (context) {
    // Creates a new KillTrigger instance
    var KillTrigger = function (entity) {
        this.entity = entity;
    };

    KillTrigger.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.entity.collision.on("triggerenter", this.onTriggerEnter, this);
        },

        onTriggerEnter: function (other) {
            if (other.script && other.script.damagable) {
                other.script.damagable.kill(this.entity);
            }
        }
    };

    return KillTrigger;
});


// How many lines of code are here nao? XD

// Player Input
// Handle input from a keyboard
// Requires:
//  - The entity must also have the platform_character_controller script attached

pc.script.create('player_input', function (context) {
    var PlayerInput = function (entity) {
        this.entity = entity;
    };

    PlayerInput.LEFT = "left";
    PlayerInput.RIGHT = "right";
    PlayerInput.JUMP = "jump";

    PlayerInput.prototype = {
        initialize: function () {
            // Create a pc.input.Controller instance to handle input
            context.controller = new pc.input.Controller(document);

            // Register all keyboard input
            context.controller.registerKeys(PlayerInput.LEFT, [pc.input.KEY_A, pc.input.KEY_Q, pc.input.KEY_LEFT])
            context.controller.registerKeys(PlayerInput.RIGHT, [pc.input.KEY_D, pc.input.KEY_RIGHT])
            context.controller.registerKeys(PlayerInput.JUMP, [pc.input.KEY_W, pc.input.KEY_SPACE, pc.input.KEY_UP])

            // Retrieve and store the script instance for the character controller
            this.playerScript = this.entity.script.platform_character_controller;
        },

        // Check for left, right or jump and send move commands to the controller script 
        update: function (dt) {
            if (context.controller.isPressed(PlayerInput.LEFT)) {
                this.playerScript.moveLeft();
            } else if (context.controller.isPressed(PlayerInput.RIGHT)) {
                this.playerScript.moveRight();
            }

            if (context.controller.wasPressed(PlayerInput.JUMP)) {
                this.playerScript.jump();
            }
        }
    };

    return PlayerInput;
});




// Basic tween functions
pc.tween = {
    /**
     * @name pc.tween.easeOutQuad
     * @description Quadratic ease out function
     * @param {Number} t The current time 
     */
    easeOutQuad: function (t) {
        return 1 - ((1 - t) * (1 - t));
    },

    /**
     * @name pc.tween.easeInOutQuad
     * @description Quadratic ease in and out function
     * @param {Number} t The current time 
     */
    easeInOutQuad: function (t) {
        if ((t *= 2) < 1) {
            return 0.5 * t * t;
        } else {
            return 1 - 0.5 * ((2 - t) * (2 - t));
        }
    },

    /**
     * @name pc.tween.easeOutCubic
     * @description Cubic ease out function
     * @param {Number} t The current time 
     */
    easeOutCubic: function (t) {
        return --t * t * t + 1;
    },

    /**
     * @name pc.tween.elasticOut
     * @description Ease out with elastic-style snap back to final position
     * @param {Number} t The current time
     * @param {Number} amplitude The size of the elastic effect
     * @param {Number} period The period of the oscillation
     */
    elasticOut: function (t, amplitude, period) {
        if (t === 0 || t === 1) {
            return t;
        }

        var s = period / (Math.PI * 2) * Math.asin(1 / amplitude);
        return (amplitude * Math.pow(2, -10 * t) * Math.sin((t - s) * (Math.PI * 2) / period) + 1);
    }
}
pc.script.attribute("moveImpulse", "number", 0.5, {displayName: "Move Impulse"}); // Horizontal impulse to apply when the left or right key is down.
pc.script.attribute("jumpImpulse", "number", 15, {displayName: "Jump Impulse"}); // Vertical impulse to apply when the jump key is pressed.
pc.script.attribute("minRunSpeed", "number", 1, {displayName: "Min Run Speed"}); // Minimum speed at which the run animation will play.
pc.script.attribute("jumpGraceTime", "number", 0.1, {displayName: "Grace Jump Time"}); // Extra time allowed to jump after falling off a platform.

// Platform Character Controller
// This is the main player controler script
// It handles moving the player, playing animations, death and resetting
// Requires: 
//  - A child entity called "Model" which has the model component and animation component. Animations as defined in the ANIMATIONS list.
//  - player_input.js script should also be attached
//  - damagable.js script should also be attached


pc.script.create('platform_character_controller', function (context) {    
    var CHECK_GROUND_RAY = new pc.Vec3(0, -0.7, 0);

    // Names of animation assets mapped to simple names like "idle"
    var ANIMATIONS = {
        "idle": "Playbot_idle",
        "run": "Playbot_run",
        "jump": "Playbot_jump",
        "die": "Playbot_die"
    };
    
    // Animation states
    var STATE_IDLE = 0;
    var STATE_RUNNING = 1;
    var STATE_JUMPING = 2;
    
    // Temp vector used to fire raycast
    var raycastEnd = new pc.Vec3();
    
    var PlatformCharacterController = function (entity) {
        this.entity = entity;
        
        this.onGround = false;
        this.groundEntity = null;
        
        this.jumpTimer = 0;
        this.fallTimer = 0;
        
        this.model = null;
        
        this.origin = null;
        
        this.dead = false;
        
        this.animationState = STATE_IDLE;
    };

    PlatformCharacterController.prototype = {
        initialize: function () {
            // store the original position for reseting
            this.origin = new pc.Vec3().copy(this.entity.getPosition());
            
            // Get the child entity that has the model and animation component
            this.model = this.entity.findByName("Model");
            
            // Attach an event to the damagable script to detect when the player is killed
            this.entity.script.damagable.on("killed", this.onKilled, this);
            
            // Uncomment this line to display collision volumes
            // context.systems.collision.setDebugRender(true);
        },
        
        update: function (dt) {
            // Don't update movement while dead
            if (this.dead) {
                return;
            }
    
            // Decrement timers
            this.jumpTimer -= dt;
            this.fallTimer -= dt;
    
            // Check to see if player is on the ground
            this.checkOnGround();
    
            var vel = this.entity.rigidbody.linearVelocity;
            var speed = vel.length();
            
            // Apply drag if in motion
            if (Math.abs(vel.x) > 0) {
                vel.x = vel.x * 0.9;                
                this.entity.rigidbody.linearVelocity = vel;
            }
            
            // Update the animation            
            this.updateAnimation(vel, dt);
        },
        
        updateAnimation: function(vel, dt) {
            var speed = Math.sqrt(vel.x*vel.x + vel.z*vel.z)
            if (this.animationState === STATE_IDLE) {
                if (speed > this.minRunSpeed) {
                    // start running
                    this.run();
                }
            } else if (this.animationState === STATE_RUNNING) {
                if (speed < this.minRunSpeed) {
                    // stop running
                    this.idle();
                }
            }
        },
        
        // Function called by player_input to move the player
        moveLeft: function () {
            if (!this.dead) {
                this.entity.rigidbody.applyImpulse(-this.moveImpulse, 0, 0);
                this.model.setEulerAngles(0, -90, 0);
            }
        },
        
        // Function called by player_input to move the player
        moveRight: function () {
            if (!this.dead) {
                this.entity.rigidbody.applyImpulse(this.moveImpulse, 0, 0);
                this.model.setEulerAngles(0, 90, 0);
            }
        },
        
        // Function called by player_input to jump the player
        jump: function () {
            if (!this.dead && this.jumpTimer < 0) {
                if (this.onGround || this.fallTimer > 0) {
                    this.entity.rigidbody.applyImpulse(0, this.jumpImpulse, 0);
                    
                    // Start the jump animation
                    this.model.animation.play(ANIMATIONS.jump, 0.1);
                    this.model.animation.speed = 1;
                    this.model.animation.loop = false;
                    
                    this.animationState = STATE_JUMPING;
                    this.jumpTimer = 0.1;
                }
            }
        },

        // Switch to run animation state and start the run animation
        run: function () {
            this.model.animation.play(ANIMATIONS.run, 0.1);
            this.model.animation.speed = 1;
            this.model.animation.loop = true;
            this.animationState = STATE_RUNNING;
        },
        
        // Switch to idle animation state and start the idle animation
        idle: function () {
            this.model.animation.play(ANIMATIONS.idle, 0.1);
            this.model.animation.loop = true;
            this.model.animation.speed = 1;
            this.animationState = STATE_IDLE;
        },
        
        // Switch to idle animation state and start the idle animation
        land: function () {
            this.model.animation.play(ANIMATIONS.idle, 0.1);
            this.model.animation.loop = true;
            this.model.animation.speed = 1;
            this.animationState = STATE_IDLE;
        },

        checkOnGround: function () {
            // Immediately after jumping we don't check for ground
            if (this.jumpTimer > 0) {
                return;
            }

            var raycastStart = this.entity.getPosition();
            raycastEnd.add2(raycastStart, CHECK_GROUND_RAY);
            
            var wasOnGround = this.onGround;
            this.onGround = false;
            this.groundEntity = null;
            
            // fire ray down and see if it hits another entity
            context.systems.rigidbody.raycastFirst(raycastStart, raycastEnd, function (result) {
                if (result.entity) {
                    this.onGround = true;
                    this.groundEntity = result.entity;
                    if (this.animationState === STATE_JUMPING) {
                        this.land();
                    }
                    if (wasOnGround) {
                        this.fallTimer = this.jumpGraceTime;
                    }
                }
            }.bind(this));
        },
        
        getGround: function () {
            return this.groundEntity;    
        },
        
        // Called by damagable script when this entity is killed
        onKilled: function (killer) {
            if (!this.dead) {
                this.model.animation.play(ANIMATIONS.die, 0.1);
                this.model.animation.speed = 1.5;
                this.model.animation.loop = false;
                this.dead = true;
                var v = this.entity.rigidbody.linearVelocity;
                v.x = 0;
                this.entity.rigidbody.linearVelocity = v;
                
                // stop body sliding
                this.entity.rigidbody.friction = 1;
                
                setTimeout(function () {
                    this.reset(this.origin);
                }.bind(this), 2000);
            }
        },
        
        // Reset the player back to a new position
        reset: function (origin) {
            this.entity.setPosition(origin);
            this.entity.rigidbody.syncEntityToBody();
            this.entity.rigidbody.linearVelocity = pc.Vec3.ZERO;
            this.entity.rigidbody.friction = 0;
            this.dead = false;
            this.idle();
        }
    };
    
    
    return PlatformCharacterController;
});
// Portal Field
// Update the animation on the portal

pc.script.attribute("playerEntityName", "string", "", {displayName: "Player Entity Name"})
pc.script.attribute("duration", "number", 1);

pc.script.create('portal_field', function (context) {
    var temp = new pc.Vec3();
    
    // Creates a new PortalField instance
    var PortalField = function (entity) {
        this.entity = entity;
        
        this.duration = 1;
        this.timer = -1;
        
        this.field = null;
        this.player = null;
    };

    PortalField.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.field = this.entity.findByName("Portal");  
            this.player = context.root.findByName(this.playerEntityName);
        },
    
        reset: function () {
            this.timer = -1;
            if(this.field) {
                this.field.setLocalScale(0.01, 0.01, 0.01);
            }
        },
        
        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if (this.timer >= 0) {
                this.timer -= dt;
                if (this.timer < 0) {
                    this.timer = 0;
                }
                
                // Use an elastic tween to bounce the field out
                var progress = pc.tween.elasticOut((this.duration - this.timer)/this.duration, 1, 0.3);
                
                if (this.field) {
                    // Update the scale from the tween. Limit the z scale so it doesn't stick out through the platforms.
                    this.field.setLocalScale(progress, progress, progress > 1 ? 1 : progress);    
                }
            } else {
                // Check to see if the player is close, when they are activate the portal
                if (this.player) {
                    var distance = temp.copy(this.player.getPosition()).sub(this.entity.getPosition()).length();
                    if (distance < 3) {
                        this.activate();
                    }
                }
            }
        },
        
        onAttributeChanged: function () {
            this.activate();
        },
        
        activate: function () {
            this.timer = this.duration;
        }
    };

    return PortalField;
});
pc.script.attribute("nextLevelEntityName", "string", "Level One", {displayName: "Next Level Entity Name"})

// Goal Script
// Add this script to create a goal which moves the player to the next level
// Requires:
//   - A child Entity called "Trigger", which is a collision trigger, when the player enters this trigger the goal is reached
//   - Another Entity in the Pack called "Levels" which contains roots of all the other levels. The currently active level is disabled and the next level is enabled

pc.script.create('goal', function (context) {
    var Goal = function (entity) {
        this.entity = entity;
        
        this.levels = null;
        this.trigger = null;
    };

    Goal.prototype = {
        initialize: function () {
            
            this.trigger = this.entity.findByName("Trigger");
            if (this.trigger && this.trigger.collision) {
                this.trigger.collision.on("triggerenter", this.onTrigger, this);    
            }
            
            this.levels = context.root.findByName("Levels");
        },
        
        getCurrentLevel: function () {
            if (this.levels) {
                var i;
                var children = this.levels.getChildren()
                for(i = 0; i < children.length;i ++) {
                    if (children[i].enabled) {
                        return children[i];
                    }
                }
            }
            
            return null;
        },
        
        // Fired when an entity enters the attached Trigger volume.
        onTrigger: function (other) {
            // Test if the entity has the "platform_character_controller" script (which means it's the player)
            if (other.script && other.script.platform_character_controller) {
                
                // disable the current level
                var currentLevel = this.getCurrentLevel();
                if (currentLevel) {
                    currentLevel.enabled = false;    
                } else {
                    console.error("Goal can't find current level")
                }
                
                
                // enable the new level
                var nextLevel = context.root.findByName(this.nextLevelEntityName);
                if (nextLevel) {
                    nextLevel.enabled = true;

                    // Get the start position from the new level and reset the player
                    var playerStart = nextLevel.findByName("PlayerStart");
                    if (playerStart) {
                        other.script.platform_character_controller.reset(playerStart.getPosition());    
                    } else {
                        console.error("Goal can't find PlayerStart entity in " + this.nextLevelEntityName);
                    }
                } else {
                    console.error("AngeTsk.js can't find Lvl30Sc.js")
                }
            }
        }
    };

   return Goal;
});
// Bullet
// The bullet is a trigger volume which moves with a given speed
// When it hits another damagable entity it does 10 damage

pc.script.create('bullet', function (context) {
    var d = new pc.Vec3();
    
    // Creates a new Bullet instance
    var Bullet = function (entity) {
        this.entity = entity;
        this.velocity = new pc.Vec3();
    };

    Bullet.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.entity.collision.on("triggerenter", this.onTriggerEnter, this);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            // Update this position according to the velocity
            d.copy(this.velocity).scale(dt);
            this.entity.translateLocal(d);
            
            // Check for some limits and disable if it gets passed it's limit
            var pos = this.entity.getLocalPosition();
            if (pos.x > 1000) {
                this.entity.enabled = false;
            } else if (pos.x < -1000) {
                this.entity.enabled = false;
            }
        },
        
        // Enable the entity and set it's velocity
        shoot: function (speed) {
            this.entity.enabled = true;
            this.velocity.set(speed, 0, 0);
        },
        
        // Fired when the trigger volume hits another entity
        onTriggerEnter: function (other) {
            // If the entity has the damagable script then do some damage and disable the bullet.
            if (other && other.script && other.script.damagable) {
                other.script.damagable.doDamage(10, this.entity);
                this.entity.enabled = false;
            }
        }
    };

    return Bullet;
});
// Enemy - Punch
// Punch is the nastier version of Spike
// Punch uses the base enemy code to move back and forth on a platform. But also does a line of sight check to see if the player is in range.
// If the player is close he fires a bullet.
// Requires:
//  - A child entity called Turret which has the gun turret model
//  - A child entity called BulletOrigin which is the point where the bullet starts
//  - The pc.tween.js librar

pc.script.attribute("bulletSpeed", "number", 3, {displayName: "Bullet Speed"}); // speed of the bullet
pc.script.attribute("losRange", "number", 4, {displayName: "Line of Sight Range"}); // distance tank can see player
pc.script.attribute("losCheckInterval", "number", 0.2, {displayName: "Line of Sight Interval"}); // time between los checks
pc.script.attribute("firingInterval", "number", 2, {displayName: "Firing Interval"}); // time between bullets
pc.script.attribute("turretAnimationDuration", "number", 2, {displayName: "Turret Anim Duration"}); // time that firing animation plays
pc.script.attribute("turretAnimationSize", "number", 0.4, {displayName: "Turret Anim Size"}); // size of the firing animation that plays

pc.script.create('enemy_punch', function (context) {
    var ray = new pc.Vec3(); // temp vector for raycasting
    var rayEnd = new pc.Vec3();
    var impulse = new pc.Vec3(); // temp vector for bullet impulse
    
    var STATE_READY = 0;
    var STATE_FIRING = 1;
    
    // Creates a new EnemyPunch instance
    var EnemyPunch = function (entity) {
        this.entity = entity;
        
        this.script = null;
        this.bullet = null;
        this.bulletOrigin = null;
        
        this.losTimer = 0;
        this.firingTimer = 0;
        this.turretAnimationTimer = 0;
        
        this.previousSpeed = 0;
        
        this.state = STATE_READY;
    };

    EnemyPunch.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            // store main enemy script, this script controls basic movement
            this.script = this.entity.script.enemy;
            
            this.turret = this.entity.findByName("Turret");
            
            this.bullet = this.createBullet();
            this.bullet.enabled = false;
            this.bulletOrigin = this.entity.findByName("BulletOrigin");
        },
    
        // Clone the BulletTemplate entity
        createBullet: function () {
            var bullet = context.root.findByName("BulletTemplate");
            var b = bullet.clone();
            context.root.addChild(b);
            return b;
        },
        
        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if (this.state === STATE_READY) {
                // In the ready state we check for Line of Sight on the player
                this.losTimer -= dt;
                if (this.losTimer < 0) {
                    this.losTimer = this.losCheckInterval;
                    this.checkPlayer();
                }
            } else if (this.state === STATE_FIRING) {
                this.firingTimer -= dt;
                if (this.firingTimer < 0) {
                    this.state = STATE_READY;
                    this.entity.script.enemy.unpause();
                }
                
                // In the firing state we update the turret animation
                if (this.turretAnimationTimer > 0) {
                    var p = this.turret.getLocalPosition();
                    p.z = this.turretAnimationSize * -this.entity.script.enemy.direction * (1 - pc.tween.elasticOut(this.turretAnimationDuration - this.turretAnimationTimer, 1, 0.3));
                    this.turret.setLocalPosition(p);
                    this.turretAnimationTimer -= dt;
                }
            }
        },
        
        checkPlayer: function () {
            // Fire a ray forwards to see if it hits the player, if it does call shoot()
            var start = this.turret.getPosition();
            ray.copy(this.entity.forward).scale(this.losRange);
            rayEnd.add2(start, ray);

            context.systems.rigidbody.raycastFirst(start, rayEnd, function (result) {
                if (result.entity && result.entity.script && result.entity.script.platform_character_controller) {
                    // hit the player
                    this.shoot();
                }
            }.bind(this));
        },
        
        shoot: function () {
            if (this.state === STATE_READY) {
                // Change state to firing, and pause the movement
                this.state = STATE_FIRING;
                this.entity.script.enemy.pause();
    
                // Initialize the bullet
                this.bullet.enabled = true;
                this.bullet.setPosition(this.bulletOrigin.getPosition());
                this.bullet.script.bullet.shoot(this.entity.forward.x * this.bulletSpeed);
                
                this.firingTimer = this.firingInterval;
                this.turretAnimationTimer = this.turretAnimationDuration;
            }
        },
        
        // Reset timers and state
        reset: function () {
            this.losTimer = 0;
            this.state = STATE_READY;
            this.bullet.enabled = false;
        }
    };

    return EnemyPunch;
});
