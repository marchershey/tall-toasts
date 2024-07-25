!(function (factory) {
  "function" == typeof define && define.amd ? define(factory) : factory();
})(function () {
  "use strict";
  document.addEventListener("alpine:initializing", function () {
    window.Alpine.data("ToastComponent", function ($wire) {
      return {
        defaultDuration: $wire.defaultDuration,
        wireToasts: $wire.$entangle("toasts"),
        prod: $wire.$entangle("prod"),
        wireToastsIndex: 0,
        toasts: [],
        pendingToasts: [],
        pendingRemovals: [],
        count: 0,
        loaded: !1,
        init: function () {
          var _this = this;
          (window.Toast = {
            component: this,
            make: function (message, title, type, duration) {
              return {
                title: title,
                message: message,
                type: type,
                duration: duration,
              };
            },
            debug: function (message) {
              var title =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : "",
                duration =
                  arguments.length > 2 && void 0 !== arguments[2]
                    ? arguments[2]
                    : void 0;
              this.component.add(
                this.make(
                  message,
                  title,
                  "debug",
                  null != duration ? duration : this.component.defaultDuration
                )
              );
            },
            info: function (message) {
              var title =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : "",
                duration =
                  arguments.length > 2 && void 0 !== arguments[2]
                    ? arguments[2]
                    : void 0;
              this.component.add(
                this.make(
                  message,
                  title,
                  "info",
                  null != duration ? duration : this.component.defaultDuration
                )
              );
            },
            success: function (message) {
              var title =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : "",
                duration =
                  arguments.length > 2 && void 0 !== arguments[2]
                    ? arguments[2]
                    : void 0;
              this.component.add(
                this.make(
                  message,
                  title,
                  "success",
                  null != duration ? duration : this.component.defaultDuration
                )
              );
            },
            warning: function (message) {
              var title =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : "",
                duration =
                  arguments.length > 2 && void 0 !== arguments[2]
                    ? arguments[2]
                    : void 0;
              this.component.add(
                this.make(
                  message,
                  title,
                  "warning",
                  null != duration ? duration : this.component.defaultDuration
                )
              );
            },
            danger: function (message) {
              var title =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : "",
                duration =
                  arguments.length > 2 && void 0 !== arguments[2]
                    ? arguments[2]
                    : void 0;
              this.component.add(
                this.make(
                  message,
                  title,
                  "danger",
                  null != duration ? duration : this.component.defaultDuration
                )
              );
            },
          }),
            addEventListener("toast", function (event) {
              _this.add(event.detail);
            }),
            this.fetchWireToasts(),
            this.$watch("wireToasts", function () {
              _this.fetchWireToasts();
            }),
            setTimeout(function () {
              (_this.loaded = !0),
                _this.pendingToasts.forEach(function (toast) {
                  _this.add(toast);
                }),
                (_this.pendingToasts = null);
            }, $wire.loadDelay);
        },
        fetchWireToasts: function () {
          var _this2 = this;
          this.wireToasts.forEach(function (toast, i) {
            i < _this2.wireToastsIndex ||
              (_this2.add(window.Alpine.raw(toast)), _this2.wireToastsIndex++);
          });
        },
        add: function (toast) {
          var _toast$type;
          if (!0 === this.loaded) {
            if ("debug" === toast.type) {
              if (this.prod) return;
              console.log(toast.title, toast.message);
            }
            (null !== (_toast$type = toast.type) && void 0 !== _toast$type) ||
              (toast.type = "info"),
              (toast.show = 0),
              (toast.index = this.count),
              (this.toasts[this.count] = toast),
              this.scheduleRemoval(this.count),
              this.count++;
          } else this.pendingToasts.push(toast);
        },
        scheduleRemoval: function (toastIndex) {
          var _this3 = this;
          Object.keys(this.pendingRemovals).includes(toastIndex.toString()) ||
            (0 !== this.toasts[toastIndex].duration &&
              (this.pendingRemovals[toastIndex] = setTimeout(function () {
                _this3.remove(toastIndex);
              }, this.toasts[toastIndex].duration)));
        },
        scheduleRemovalWithOlder: function () {
          for (
            var toastIndex =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : this.count,
              i = 0;
            i < toastIndex;
            i++
          )
            this.scheduleRemoval(i);
        },
        cancelRemovalWithNewer: function (toastIndex) {
          for (var i = this.count - 1; i >= toastIndex; i--)
            clearTimeout(this.pendingRemovals[i]),
              delete this.pendingRemovals[i];
        },
        remove: function (index) {
          var _this4 = this;
          this.toasts[index] && (this.toasts[index].show = 0),
            setTimeout(function () {
              (_this4.toasts[index] = ""), delete _this4.pendingRemovals[index];
            }, 500);
        },
      };
    });
  });
});
//# sourceMappingURL=tall-toasts.js.map
