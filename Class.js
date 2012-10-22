/**
 * Created with JetBrains WebStorm.
 * User: Leo Zhang
 * Date: 12-10-19
 * Time: 上午1:07
 *
 *
 * Usage: var Panel = Class.create(null?, instanceConfigObject);
 *        var panel = new Panel(configurationObject?);
 *        var EditPanel = Class.create(Panel?, instanceConfigObject);
 *        var textEditor = new EditPanel(configurationObject?);
 */

;
(function(global) {

    var Class = {},
        hasOwnProperty = Object.prototype.hasOwnProperty,
        toString = Object.prototype.toString,
        slice = Array.prototype.slice,
        create = function(o) {
            var F = function (){};
            F.prototype = o;
            return new F();
        },
        extend = function(target, mixin, overwrite) {
            var isIn;
            for(var attr in mixin) {
                if(hasOwnProperty.call(mixin, attr)) {
                    isIn = hasOwnProperty.call(target, attr);
                    if((isIn && overwrite) || !isIn) {
                        target[attr] = mixin[attr];
                    }
                }
            }
        };

    Class.create = function(Parent, PropObj) {
        var parent,
            classy,
            config;

        classy = function(){
            var su = classy.uber,
                i,
                fs = [];

            while(su && su.hasOwnProperty('_init')) {
                fs.push(su._init);
                su = su.constructor.uber;
            }
            for(i=fs.length; i--;) {
                fs[i].apply(this, arguments);
            }
            if(classy.prototype.hasOwnProperty('_init')) {
                classy.prototype._init.apply(this, arguments);
            }
        };


        if (typeof Parent === 'function') {
            parent = Parent;
            config = PropObj || {};
        } else if (toString.call(Parent) === '[object Object]') {
            parent = Object;
            config = Parent || {};
        } else {
            parent = Object;
            config = {};
        }

        return (function() {

            this.prototype = create(parent.prototype);
            this.prototype.constructor = this;
            this.uber = parent.prototype;
            this.extend = function(mixinObj, overwrite) {
                extend(this, mixinObj, !!overwrite);
                if(mixinObj.callback) {
                    mixinObj.callback.call(this);
                }
                return this;
            };
            this.include = function(mixinObj, overwrite) {
                extend(this.prototype, mixinObj, !!overwrite);
                if(mixinObj.callback) {
                    mixinObj.callback.call(this);
                }
                return this;
            };
            this.include(config, true).include({
                base: function(method) {
                    var args = slice.call(arguments, 1);
                    if (typeof method === 'string' && this.constructor.uber[method]) {
                        return this.constructor.uber[method].apply(this, args);
                    }
                }
            });

            return this;

        }).call(classy);

    };

    global.Class = Class;

})(this);
