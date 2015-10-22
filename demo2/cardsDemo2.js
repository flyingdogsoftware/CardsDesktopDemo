(function ($) {
    $.fn.getStyleObject = function () {
        var dom = this.get(0);
        var style;
        var returns = {};
        if (window.getComputedStyle) {
            var camelize = function (a, b) {
                return b.toUpperCase();
            }
            style = window.getComputedStyle(dom, null);
            for (var i = 0; i < style.length; i++) {
                var prop = style[i];
                var camel = prop.replace(/\-([a-z])/g, camelize);
                var val = style.getPropertyValue(prop);
                returns[camel] = val;
            }
            return returns;
        }
        if (dom.currentStyle) {
            style = dom.currentStyle;
            for (var prop in style) {
                returns[prop] = style[prop];
            }
            return returns;
        }
        return this.css();
    }
})(jQuery);

(function ($) {

    $.fn.bodysnatch = function () {
        //rA = [];
        var collection = this;
        //console.log(collection)
        return collection.each(function (a, b) {
            var element = $(this);
            var clone = element.clone();

            var w = element.width(),
                h = element.height();
            var translate_values = 'translateX(' + element.offset().left + 'px) translateY(' + element.offset().top + 'px)';

            //otherwise not loaded image will be stuck with zero width/height
            if (w && h) {
                //cssText returns "" on FF!!!
                if (window.getComputedStyle && window.getComputedStyle.cssText) {
                    clone.attr('style', window.getComputedStyle(element[0]).cssText);
                }
                else {
                    clone.css(element.getStyleObject());
                }

                clone.css({
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    //hot fix for the 101 balls samplein FF and opera
                    //due to idiotic behaviour of
                    //https://developer.mozilla.org/de/docs/DOM/window.getComputedStyle
                    //'background-color': element.css('background-color'),
                    width: element.width(),
                    height: element.height(),
                    margin: 0,
                    "-webkit-transform": translate_values,
                    "-moz-transform": translate_values,
                    "-ms-transform": translate_values,
                    "-o-transform": translate_values,
                    "transform": translate_values
                    //padding: 0
                });
                clone.addClass('perfect');
            }
            else //probably images without a width and height yet
            {
                clone.css({
                    position: 'absolute',
                    margin: 0,
                    left: 0,
                    top: 0,
                    "-webkit-transform": translate_values,
                    "-moz-transform": translate_values,
                    "-ms-transform": translate_values,
                    "-o-transform": translate_values,
                    "transform": translate_values
                });
                clone.addClass('imperfect');
            }
            //clone.hide();
            //$('body').append(clone);
            //clone.show();
            if (element[0].id) {
                element[0].id = element[0].id + '_snatched';
            }
            element.addClass('snatched');
            clone.addClass('bodysnatcher');
            //stop audio and videos
            element.css('visibility', 'hidden');
            if (element[0].pause) {
                //console.log('video or audio')
                element[0].pause();
                element[0].src = '';
            }
            collection[a] = clone[0]
            $('body').append(clone);
            //experiments for better rendering
            //window.setTimeout(function(){element.css('visibility','hidden');},0);
            //windiw.setTimeout(function(){element.css('visibility','hidden');}, 0);
        });
        //return $(rA);
    };
})(jQuery);
(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());
(function () {
    var $, D2R, D_E_B_U_G, DragHandler, clickedCard, zoomOutCard, zoomedIn, MutationObserver, PI2, R2D, SCALE, SCALE_ORG, SCALE_MULTIPLIER, S_T_A_R_T_E_D, applyCustomGravity, areaDetection, areas, b2AABB, b2Body, b2BodyDef, b2CircleShape, b2ContactListener, b2DebugDraw, b2Fixture, b2FixtureDef, b2MassData, b2MouseJointDef, b2WeldJointDef,b2PolygonShape, b2RevoluteJointDef, b2Vec2, b2World, bodyKey, bodySet, cleanGraveyard, createBox, createCircle, createDOMObjects, default_density, default_friction, default_passive, default_restitution, default_shape, default_static, drawDOMObjects, fpsEl, graveyard, hw, interval, isMouseDown, measureTime, mouseJoint, mousePVec, mouseX, mouseY, mutationConfig, mutationHandler, mutationObserver, selectedBody, startWorld, time0, update, world, x_velocity, y_velocity;

    b2Vec2 = Box2D.Common.Math.b2Vec2;

    b2AABB = Box2D.Collision.b2AABB;

    b2BodyDef = Box2D.Dynamics.b2BodyDef;

    b2Body = Box2D.Dynamics.b2Body;

    b2FixtureDef = Box2D.Dynamics.b2FixtureDef;

    b2Fixture = Box2D.Dynamics.b2Fixture;

    b2World = Box2D.Dynamics.b2World;

    b2MassData = Box2D.Collision.Shapes.b2MassData;

    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;

    b2ContactListener = Box2D.Dynamics.b2ContactListener;

    b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

    b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;

    b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;

    b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef;

    $ = jQuery;

    hw = {
        '-webkit-transform': 'translateZ(0)',
        '-moz-transform': 'translateZ(0)',
        '-o-transform': 'translateZ(0)',
        'transform': 'translateZ(0)'
    };
    zoomedIn = false;

    S_T_A_R_T_E_D = false;

    D_E_B_U_G = false;

    world = {};

    x_velocity = 0;

    y_velocity = 0;

    SCALE = SCALE_ORG = 30;

    SCALE_MULTIPLIER = 1;

    D2R = Math.PI / 180;

    R2D = 180 / Math.PI;

    PI2 = Math.PI * 2;

    interval = {};

    default_static = false;

    default_density = 1.5;

    default_friction = 0.3;

    default_restitution = 0.4;

    default_shape = 'box';

    default_passive = false;

    mouseX = 0;

    mouseY = 0;

    mousePVec = void 0;

    isMouseDown = false;

    selectedBody = void 0;

    mouseJoint = void 0;

    MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    mutationObserver = void 0;

    mutationConfig = {
        attributes: false,
        childList: true,
        characterData: false
    };

    bodySet = {};

    bodyKey = 0;

    areas = [];

    graveyard = [];

    time0 = 0;

    fpsEl = void 0;

    var currentElement = null;
    var currentZIndex = 1;
    DragHandler = (function () {
        var downHandler, moveHandler, upHandler, updateFromEvent;
        selectedBody = void 0;
        mouseJoint = false;
        mouseX = void 0;
        mouseY = void 0;

        // mouse up
        upHandler = function () {


            if (selectedBody) {
                mouseX = null;
                mouseY = null;


                // stop animation after 1/2 second
                var bdy = selectedBody;
                setTimeout(function () {
                    bdy.SetAwake(false);
                }, 1000);
                return selectedBody = null;
            }
        };
        // move mouse
        moveHandler = function (e) {
            if (selectedBody) {
                return updateFromEvent(e);
            }
        };
        // mouse down
        downHandler = function (domEl, e) {
            if (zoomedIn) return;   // do nothing in this mode
            var fixture;
            fixture = bodySet[domEl.attr('data-box2d-bodykey')];
            if (!fixture.GetUserData().isPassive) {
                selectedBody = fixture.GetBody();

                if (fixture.m_userData) {
                    currentElement = fixture.m_userData.domObj;
                    if (!currentElement.hasClass("pen")) {
                        zoomOutCard = $(currentElement);

                        $(currentElement).css("z-index", currentZIndex++);          // set card on top
                    };


                }

                return updateFromEvent(e);
            }
        };
        $(document).mouseup(upHandler);
        $(document).mousemove(moveHandler);
        updateFromEvent = function (e) {
            var touch;
            e.preventDefault();
            touch = e.originalEvent;
            if (touch && touch.touches && touch.touches.length === 1) {
                touch.preventDefault();
                mouseX = touch.touches[0].pageX;
                mouseY = touch.touches[0].pageY;
            } else {
                mouseX = e.pageX;
                mouseY = e.pageY;
            }
            mouseX = mouseX / SCALE;
            return mouseY = mouseY / SCALE;
        };
        return {
            register: function (domEl) {
                domEl.mousedown(function (e) {
                    return downHandler(domEl, e);
                });
                domEl.bind('touchstart', function (e) {
                    return downHandler(domEl, e);
                });
                domEl.bind('touchend', upHandler);
                return domEl.bind('touchmove', moveHandler);
            },
            updateMouseDrag: function () {
                var md;
                if (selectedBody && (!mouseJoint)) {    // connect card to mouse pointer
                    md = new b2MouseJointDef();
                    md.bodyA = world.GetGroundBody();
                    md.bodyB = selectedBody;
                    md.target.Set(mouseX, mouseY);
                    md.collideConnected = true;
                    md.dampingRatio = 0;
                    md.frequencyHz = 100;
                    md.maxForce = 30000.0 * selectedBody.GetMass(); // higher value:  objects follows more directly to mouse cursor
                    mouseJoint = world.CreateJoint(md);

                    selectedBody.SetAngularDamping(5.5);      // 5.5 slows down animation much faster
                    selectedBody.SetAwake(true);
                }
                if (mouseJoint) {
                    if (selectedBody) {
                        return mouseJoint.SetTarget(new b2Vec2(mouseX, mouseY));
                    } else {
                        world.DestroyJoint(mouseJoint);
                        return mouseJoint = null;
                    }
                }
            }
        };
    })();


    createDOMObjects = function (jquery_selector, collisionDetection) {
        shape = default_shape;
        static_ = default_static;
        density = default_density;
        restitution = default_restitution;
        friction = default_friction;
        passive = default_passive;

        $(document).click(function (event) {

            if (!zoomedIn) return;
            if ($(event.target).closest(".card").length) return;
            if ($(event.target).closest(".pen").length) return;


            var zoomInterval = setInterval(function () {
                SCALE = SCALE_ORG * SCALE_MULTIPLIER;
                SCALE_MULTIPLIER -= 0.04;
                if (SCALE <= SCALE_ORG) {
                    clearInterval(zoomInterval);
                    zoomedIn = false;
                    $('.card').attr('contenteditable', false);
                    zoomOutCard = null;

                }
            }, 50);
        });
        return $(jquery_selector).each(function (a, b) {
            $(this).bind("dblclick doubletap",function () {
                if (zoomedIn) return;
                SCALE_MULTIPLIER = 1;
                clickedCard = $(this);
                $(".card").not($(this)[0]).find(".text, img").hide();
                var zoomInterval = setInterval(function () {
                    SCALE = SCALE_ORG * SCALE_MULTIPLIER;
                    SCALE_MULTIPLIER += 0.04;
                    if (SCALE >= SCALE_ORG * 1.5) {
                        clearInterval(zoomInterval);
                        zoomedIn = true;
                        $('.card').attr('contenteditable', true);
                        zoomOutCard = clickedCard;
                        clickedCard = null;
                    }
                }, 50);
            });
            var body, domObj, domPos, full_height, full_width, height, make_density, make_friction, make_passive, make_restitution, make_shape, make_static, origin_values, r, width, x, y;
            domObj = $(b);
            full_width = domObj.width();
            full_height = domObj.height();
            if (!(full_width && full_height)) {
                if (domObj.attr('src')) {
                    if (typeof console !== "undefined" && console !== null) {
                        console.log(' - box2d-jquery ERROR: an element withour width or height, will lead to strangeness!');
                    }
                    domObj.on('load', function () {
                        return createDOMObjects(this, collisionDetection);
                    });
                }
                return true;
            }
            var rt = (Math.floor(Math.random() * 359));
            var rn = (Math.floor(Math.random() * 50));
            // $(b).css({'transform':'rotate(' + rt + 'deg)'});
            // $(b).css({'-webkit-transform':'rotate(' + rt + 'deg)'});

            domPos = $(b).position();
            width = full_width / 2;
            height = full_height / 2;
            x = domPos.left + width;
            y = domPos.top + height;

            if (domObj.attr('data-box2d-static') === "true") {
                make_static = true;
            } else if (domObj.attr('data-box2d-static') === "false") {
                make_static = false;
            } else {
                make_static = static_;
            }
            if (domObj.attr('data-box2d-passive') === "true") {
                make_passive = true;
            } else if (domObj.attr('data-box2d-passive') === "false") {
                make_passive = false;
            } else {
                make_passive = passive;
            }
            body = createBox(x, y, width, height, true, collisionDetection,$(domObj).data("angle"));

            body.m_userData = {
                domObj: domObj,
                width: width,
                height: height,
                isPassive: make_passive
            };
            origin_values = '50% 50% 0';
            domObj.css({
                "-webkit-transform-origin": origin_values,
                "-moz-transform-origin": origin_values,
                "-ms-transform-origin": origin_values,
                "-o-transform-origin": origin_values,
                "transform-origin": origin_values
            });
            domObj.attr('data-box2d-bodykey', bodyKey);
            DragHandler.register(domObj);
            bodySet[bodyKey] = body;
            bodyKey++;
            return true;
        });
    };
    var bodyB;
    var wjc=0;
    /**
     * add new card or box to scene
     * @param x - x position, will be ignnored with sceneBox=true
     * @param y - y position,  will be ignnored with sceneBox=true
     * @param width - width from center
     * @param height - height from center (=/2 from normal height)
     * @param sceneBox - true: is a box/card which can be moved around, position and initial rotation will be set random
     * @param collisionDetection - activate collision detection betweeen cards, sceneBox=false always have collision detection
     * @param angle the rotation
     */
    createBox = function (x, y, width, height, sceneBox, collisionDetection,angle) {

        var bodyDef, fixDef;

        bodyDef = new b2BodyDef;
        if (sceneBox) {
            bodyDef.angle = angle;
            bodyDef.type = b2Body.b2_dynamicBody;		// element can be moved around
        } else {
            bodyDef.type = b2Body.b2_staticBody;	// static like walls
        }

        bodyDef.position.x = x / SCALE;
        bodyDef.position.y = y / SCALE;
        fixDef = new b2FixtureDef;
        fixDef.density = default_density;
        fixDef.friction = default_friction;
        fixDef.restitution = default_restitution;
        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox(width / SCALE, height / SCALE);
        // minus value: element of this group do not make collision detection (=overlapping  cards)
        if (sceneBox && !collisionDetection) fixDef.filter.groupIndex = -8;

        var fixture = world.CreateBody(bodyDef).CreateFixture(fixDef);


        return fixture;
    };


    drawDOMObjects = function () {
        var b, css, domObj, f, i, r, translate_values, x, y, _results;
        i = 0;
        b = world.m_bodyList;
        _results = [];
        while (b) {
            f = b.m_fixtureList;
            var angularVelocity = Math.abs(b.GetAngularVelocity());
            while (f) {
                if (f.m_userData) {
                    domObj = f.m_userData.domObj;

                    x = Math.floor((f.m_body.m_xf.position.x * SCALE)- f.m_userData.width*SCALE / SCALE_ORG  );
                    y = Math.floor((f.m_body.m_xf.position.y * SCALE) - f.m_userData.height*SCALE / SCALE_ORG );
                    x = x + 'px';
                    y = y + 'px';
                    r = Math.round(((f.m_body.m_sweep.a + PI2) % PI2) * R2D * 100) / 100;
                    translate_values = ["translateX(", x, ') translateY(', y, ')'].join('');
                    translate_values += " rotate(" + r + "deg)";
                    css = {
                        "-webkit-transform": translate_values,
                        "-moz-transform": translate_values,
                        "-ms-transform": translate_values,
                        "-o-transform": translate_values,
                        "transform": translate_values
                    };
                    if (domObj.prop("tagName")!="IMG") {    // no shadow for pen at the moment
                        // show shadow
                        if (angularVelocity > 0.2 && angularVelocity < 3.0) {
                            $(domObj).removeClass("shadow2");
                            $(domObj).removeClass("shadow3");
                            $(domObj).addClass("shadow1");
                        } else if (angularVelocity >= 3.0 && angularVelocity < 5.0) {
                            $(domObj).removeClass("shadow1");
                            $(domObj).removeClass("shadow3");
                            $(domObj).addClass("shadow2");
                        } else if (angularVelocity >= 5.0) {
                            $(domObj).removeClass("shadow1");
                            $(domObj).removeClass("shadow2");
                            $(domObj).addClass("shadow3");
                        } else {
                            $(domObj).removeClass("shadow1");
                            $(domObj).removeClass("shadow2");
                            $(domObj).removeClass("shadow1");
                        }
                    }

                    css["font-size"] = parseInt(SCALE / SCALE_ORG * 18) + "px"; // 18 px font size
                    css["padding"] = parseInt(SCALE / SCALE_ORG * 10) + "px"; // 10 px padding

                    var vertices_2 = f.m_body.m_fixtureList.m_shape.m_vertices[2];
                    var css_width = vertices_2.x * SCALE * 2;
                    var css_height = vertices_2.y * SCALE * 2;
                    css["width"] = css_width + "px";
                    css["height"] = css_height + "px";
                    css["overflow"] = "hidden";

                    f.m_userData.domObj.css(css);
                    // scroll to clicked card
                    if (clickedCard && $(domObj).attr("id") == clickedCard.attr("id")) {
                        $('body').scrollTo(clickedCard, {
                            limit: false,
                            offset: {
                                left: -$(window).width() / 2 + vertices_2.x * SCALE_ORG * 3,
                                top: -$(window).height() / 2 + vertices_2.y * SCALE_ORG * 3
                            }
                        });

                    }
                }
                f = f.m_next;
            }
            _results.push(b = b.m_next);
        }
        return _results;
    };

    applyCustomGravity = function () {
        var b, f, force, _results;
        b = world.m_bodyList;
        _results = [];
        while (b) {
            f = b.m_fixtureList;
            while (f) {
                if (f.m_userData && f.m_userData.gravity) {
                    force = f.GetUserData().gravity;
                    f.GetBody().ApplyForce(force, f.GetBody().GetWorldCenter());
                }
                f = f.m_next;
            }
            _results.push(b = b.m_next);
        }
        return _results;
    };

    areaDetection = (function () {
        var _elementsInArea;
        _elementsInArea = [];
        return function () {
            var aabb, area, elements, i, joined, left, shape, shapes, _i, _j, _len, _len1, _results;
            _results = [];
            for (i = _i = 0, _len = areas.length; _i < _len; i = ++_i) {
                area = areas[i];
                if (!_elementsInArea[i]) {
                    _elementsInArea[i] = [];
                }
                aabb = new b2AABB();
                aabb.lowerBound = new b2Vec2(area[0] / SCALE, area[1] / SCALE);
                aabb.upperBound = new b2Vec2(area[2] / SCALE, area[3] / SCALE);
                shapes = [];
                world.QueryAABB(function (shape) {
                    shapes.push(shape);
                    return true;
                }, aabb);
                elements = [];
                for (_j = 0, _len1 = shapes.length; _j < _len1; _j++) {
                    shape = shapes[_j];
                    if (shape.GetUserData()) {
                        elements.push(shape.GetUserData().domObj);
                    }
                }
                joined = $(elements).not(_elementsInArea[i]);
                left = $(_elementsInArea[i]).not(elements);
                _elementsInArea[i] = elements;
                if (joined.length !== 0) {
                    _results.push($(document).trigger('areajoined', {
                        areaIndex: i,
                        joinedEl: joined,
                        areaElements: _elementsInArea[i]
                    }));
                } else {
                    if (left.length !== 0) {
                        _results.push($(document).trigger('arealeft', {
                            areaIndex: i,
                            leftEl: left,
                            areaElements: _elementsInArea[i]
                        }));
                    } else {
                        _results.push(void 0);
                    }
                }
            }
            return _results;
        };
    })();

    measureTime = function () {
        var fps, now;
        now = (window['performance'] && performance.now()) || +(new Date);
        fps = 1000 / (now - time0);
        fpsEl.text((fps >> 0) + ' fps');
        return time0 = now;
    };

    update = function () {
        cleanGraveyard();
        DragHandler.updateMouseDrag();
        applyCustomGravity();
        if (areas.length > 0) {
            areaDetection();
        }
        world.Step(2 / 60, 8, 3);
        drawDOMObjects();
        if (D_E_B_U_G) {
            world.DrawDebugData();
            measureTime();
        }
        world.ClearForces();
        return window.setTimeout(update, 1000 / 30);
    };

    mutationHandler = function (mutations) {
        return mutations.forEach(function (mutation) {
            var node, _i, _len, _ref, _results;
            if (mutation.removedNodes.length > 0) {
                _ref = mutation.removedNodes;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    node = _ref[_i];
                    _results.push((function (node) {
                        var index;
                        index = $(node).attr('data-box2d-bodykey');
                        if (bodySet[index] != null) {
                            return graveyard.push([index, bodySet[index]]);
                        }
                    })(node));
                }
                return _results;
            }
        });
    };

    cleanGraveyard = function () {
        var zombie, _results;
        _results = [];
        while (graveyard.length > 0) {
            zombie = graveyard.pop();
            zombie[1].GetBody().SetUserData(null);
            world.DestroyBody(zombie[1].GetBody());
            _results.push(delete bodySet[zombie[0]]);
        }
        return _results;
    };

    startWorld = function (jquery_selector, density, restitution, friction) {
        var canvas, contactListener, debugDraw, h, w;
        if (density == null) {
            density = default_density;
        }
        if (restitution == null) {
            restitution = default_restitution;
        }
        if (friction == null) {
            friction = default_friction;
        }
        S_T_A_R_T_E_D = true;
        world = new b2World(new b2Vec2(x_velocity, y_velocity), false);
        w = $(window).width();
        h = $(window).height();


        createBox(0, -1, $(window).width(), 1);
        createBox($(window).width() + 1, 0, 1, $(window.document).height());
        createBox(-1, 0, 1, $(window.document).height());
        createBox(0, $(window.document).height() + 1, $(window).width(), 1);

        contactListener = new b2ContactListener;
        contactListener.BeginContact = function (contact) {
            var node0, node1, _ref, _ref1;
            node0 = (_ref = contact.GetFixtureA().GetUserData()) != null ? _ref.domObj : void 0;
            node1 = (_ref1 = contact.GetFixtureB().GetUserData()) != null ? _ref1.domObj : void 0;
            if ((node0 != null) && (node1 != null)) {
                return node0.trigger('collisionStart', node1);
            }
        };
        contactListener.EndContact = function (contact) {
            var node0, node1, _ref, _ref1;
            node0 = (_ref = contact.GetFixtureA().GetUserData()) != null ? _ref.domObj : void 0;
            node1 = (_ref1 = contact.GetFixtureB().GetUserData()) != null ? _ref1.domObj : void 0;
            if ((node0 != null) && (node1 != null)) {
                return node0.trigger('collisionEnd', node1);
            }
        };
        world.SetContactListener(contactListener);
        mutationObserver = new MutationObserver(mutationHandler);
        mutationObserver.observe(document.body, mutationConfig);
        if (D_E_B_U_G) {
            debugDraw = new b2DebugDraw();
            canvas = $('<canvas></canvas>');
            debugDraw.SetSprite(canvas[0].getContext("2d"));
            debugDraw.SetDrawScale(SCALE);
            debugDraw.SetFillAlpha(0.3);
            debugDraw.SetLineThickness(1.0);
            debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
            canvas.css('position', 'absolute');
            canvas.css('top', 0);
            canvas.css('left', 0);
            canvas.css('border', '1px solid green');
            canvas.attr('width', $(window).width());
            canvas.attr('height', $(document).height());
            world.SetDebugDraw(debugDraw);
            fpsEl = $('<div style="position:absolute;bottom:0;right:0;background:red;padding:5px;">0</div>');
            $('body').append(canvas).append(fpsEl);
        }
        return update();
    };

    $.Physics = (function () {
        var getBodyFromEl, getFixtureFromEl, getVectorFromForceInput;
        getFixtureFromEl = function (el) {
            bodyKey = el.attr('data-box2d-bodykey');
            return bodySet[bodyKey];
        };
        getBodyFromEl = function (el) {
            var fixture;
            fixture = getFixtureFromEl(el);
            return fixture && fixture.GetBody();
        };
        getVectorFromForceInput = function (force) {
            force = $.extend({}, {
                x: 0,
                y: 0
            }, force);
            return new b2Vec2(force.x, force.y);
        };
        return {
            applyForce: function (el, force) {
                var body;
                body = getBodyFromEl(el);
                return body.ApplyForce(getVectorFromForceInput(force), body.GetWorldCenter());
            },
            applyImpulse: function (el, force) {
                var body;
                body = getBodyFromEl(el);
                return body.ApplyImpulse(getVectorFromForceInput(force), body.GetWorldCenter());
            },
            setWorldGravity: function (force) {
                return world.SetGravity(new b2Vec2(force['x-velocity'], force['y-velocity']));
            },
            setElementGravity: function (el, force) {
                var fixture;
                fixture = getFixtureFromEl(el);
                return fixture.m_userData.gravity = getVectorFromForceInput(force);
            }
        };
    })();

    $.fn.extend({
        box2d: function (options) {
            var absolute_elements, debug, density, friction, opts, restitution, self, shape, static_;
            self = $.fn.box2d;
            opts = $.extend({}, self.default_options, options);
            x_velocity = opts['x-velocity'];
            y_velocity = opts['y-velocity'];
            debug = opts['debug'];
            areas = opts['area-detection'] || [];
            if (S_T_A_R_T_E_D === false) {
                if (debug === true) {
                    D_E_B_U_G = true;
                }
                startWorld(this, density, restitution, friction);
            }
            absolute_elements = this.bodysnatch();
            createDOMObjects(absolute_elements, opts.collisionDetection);
            return $(absolute_elements);
        }
    });

    $.extend($.Physics, {
        default_options: {
            'collisionDetection': false,
            'x-velocity': 0,
            'y-velocity': 0,
            'area-detection': [],
            'debug': D_E_B_U_G
        }
    });

}).call(this);
