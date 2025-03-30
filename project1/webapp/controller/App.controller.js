sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function (Controller, JSONModel, MessageToast, MessageBox) {
  "use strict";

  return Controller.extend("zrobto.todo.controller.App", { 

      onInit: function () {
          this._lastDeletedTodo = null; 
          this._lastDeletedIndex = null; 
      },

      onAddTodo: function () {
          var oModel = this.getView().getModel();
          var aTodos = oModel.getProperty("/todos");
          var sNewTodoTitle = this.byId("newTodoInput").getValue();

          if (!sNewTodoTitle) {
              MessageBox.error("Enter a task title");
              return;
          }

          var newTodo = {
              id: aTodos.length + 1, 
              title: sNewTodoTitle, 
              completed: false
          };

          aTodos.push(newTodo);
          oModel.setProperty("/todos", aTodos);
          this.byId("newTodoInput").setValue("");
          MessageToast.show("New task added");
      },

      onSelectionChange: function (oEvent) {
          try {
              var oSelectedItem = oEvent.getParameter("listItem");
              var sPath = oSelectedItem.getBindingContext().getPath();
              var oDialog = this.byId("editDialog");

              if (!oDialog) {
                  oDialog = sap.ui.xmlfragment(this.getView().getId(), "zrobto.todo.view.EditDialog", this); 
                  this.getView().addDependent(oDialog);
              }
              oDialog.bindElement(sPath);
              oDialog.open();
          } catch (error) {
              MessageBox.error("Błąd podczas otwierania okna dialogowego");
              console.error(error);
          }
      },

      onSave: function () {
          this.byId("editDialog").close();
          MessageToast.show("Changes saved");
          this.byId("todoList").getBinding("items").refresh(); 
      },

      onDelete: function () {
          var oDialog = this.byId("editDialog");
          var sPath = oDialog.getBindingContext().getPath();
          var oModel = this.getView().getModel();
          var aTodos = oModel.getProperty("/todos");
          var index = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));

          this._lastDeletedTodo = aTodos[index];
          this._lastDeletedIndex = index;

          aTodos.splice(index, 1);
          oModel.setProperty("/todos", aTodos);

          oDialog.close();
          MessageToast.show("Task deleted");
          this.byId("todoList").getBinding("items").refresh();
          this.byId("undoButton").setVisible(true);
      },

      onCancel: function () {
          this.byId("editDialog").close();
      },

      onUndoDelete: function () {
          if (this._lastDeletedTodo) {
              var oModel = this.getView().getModel();
              var aTodos = oModel.getProperty("/todos");

              aTodos.splice(this._lastDeletedIndex, 0, this._lastDeletedTodo);
              oModel.setProperty("/todos", aTodos);

              this._lastDeletedTodo = null;
              this._lastDeletedIndex = null;

              MessageToast.show("Task restored");
              this.byId("todoList").getBinding("items").refresh();
              this.byId("undoButton").setVisible(false);
          }
      }
  });
});
