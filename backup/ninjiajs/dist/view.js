'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var rendererCreator = function rendererCreator(router) {

    var renderer = {
        setHandler: function setHandler(cb) {
            renderer.handler = cb;
        },
        enter: function enter(tag, from, callback) {
            if (!tag) {
                return;
            }
            tag.trigger('enter', from);
            // tag.opts.show = true;
            // tag.opts.$show = true;
            // tag.opts.hidden = false;
            if (renderer.handler) {
                return renderer.handler('enter', tag);
            }
            tag.update();
        },

        leaveUpstream: function leaveUpstream(tag) {
            if (!tag || !tag.parent || !tag.parent.tags || !tag.parent.tags['router-outlet']) {
                return;
            }
            var routes = tag.parent.tags['router-outlet'].routes;
            var siblings = tag.parent.tags['router-outlet'].routes.filter(function(r){
                return r.tag && r.tag != tag
            });
            if(!siblings || !siblings.length){
                return false;
            }
            siblings.map(function(t){ return t.tag }).forEach(function(t){
                if (t && (t.opts.show || t.opts.$show)) {
                    renderer.leaveDownstream(t, tag);
                }
            })
            return renderer.leaveUpstream(tag.parent);
            // console.warn(tag.parent.tags['router-outlet'].routes.filter(r => r.tag)[0]);
            // Object.keys(tag.parent.tags).map(function (k) {
            //     return tag.parent.tags[k];
            // }).filter(function (t) {
            //     return t != tag;
            // }).forEach(function (t) {
            //     if (t && (t.opts.show || t.opts.$show)) {
            //         renderer.leaveDownstream(t, tag);
            //     }
            // });
            // return renderer.leaveUpstream(tag.parent);
        },

        leaveDownstream: function leaveDownstream(tag, parent) {
            if (!tag) {
                return;
            }
            renderer.leave(tag, parent);
            var outlet = tag.tags['router-outlet'];
            if(!outlet){
                return;
            }
            var routes = outlet.routes;
            if(!routes){
                return;
            }
            routes.map(function(r){return r.tag}).forEach(function(t){
                if (t && t.opts.$show && !t.cache) {
                    renderer.leave(t, tag);
                    return renderer.leaveDownstream(t, tag);
                }
            })
            // if (tag.tags && Object.keys(tag.tags).length) {
            //     Object.keys(tag.tags).map(function (tagName, i) {
            //         var tmp = tag.tags[tagName];
            //         var t = null;
            //         if (Array.isArray(tmp)) {
            //             t = tmp[i];
            //         } else {
            //             t = tmp;
            //         }
            //         if (t && t.opts.$show && !t.cache) {
            //             renderer.leave(t, tag);
            //             return renderer.leaveDownstream(t, tag);
            //         }
            //     });
            // }
        },

        leave: function leave(tag, to, callback) {
            if (!tag) {
                return;
            }
            tag.trigger('leave', tag);
            if (tag.opts.$show) {
                // tag.opts.show = false;
                // tag.opts.$show = false;
                // tag.opts.hidden = true;
                if (renderer.handler) {
                    return renderer.handler('leave', tag);
                }
                tag.update();
            }
        },

        init: function init(tag, name) {
            tag.opts.hidden = true;
            tag.opts.show = false;
        }
    };

    router.on('history-pending', function (from, to) {
        if (from && from.tag) {
            from.tag.trigger('before-leave');
        }
    });

    router.on('history-resolve', function (from, to, ctx, hints, index, next) {
        var fromTag = from && from.tag || null;
        var toTag = to && to.tag || null;
        renderer.enter(toTag, fromTag);
        renderer.leaveUpstream(toTag);
        next();
    });

    router.on('history-success', function (from, to) {
        // to && to.tag && to.tag.trigger('entered');
    });

    return renderer;
};

exports.default = rendererCreator;