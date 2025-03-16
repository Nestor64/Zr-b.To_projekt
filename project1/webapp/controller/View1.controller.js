sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("project1.controller.View1", {
        onInit() {
        },

        onBtnPress: function () {
         MessageToast.show("Działa!");
        }
    });
});