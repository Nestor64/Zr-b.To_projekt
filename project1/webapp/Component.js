sap.ui.define([
    "sap/ui/core/UIComponent"
], function (UIComponent) {
    "use strict";

    return UIComponent.extend("zrobto.todo.Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            try {
                // Initialize the parent
                UIComponent.prototype.init.apply(this, arguments);

                // Initialize the router
                const oRouter = this.getRouter();
                if (oRouter) {
                    oRouter.initialize();
                    console.log("Router initialized successfully.");
                } else {
                    throw new Error("Router initialization failed");
                }
            } catch (error) {
                console.error("Error during Component initialization:", error);
                throw error;
            }
        }
    });
});
