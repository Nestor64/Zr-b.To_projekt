sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function (Controller, JSONModel, MessageToast, MessageBox) {
  "use strict";

  return Controller.extend("zrobto.todo.controller.App", { 

      onInit: function () {
          // Model jest już zdefiniowany w manifest.json,
          // więc nie musimy go tutaj inicjalizować.
          this._lastDeletedTodo = null; // Przechowuje ostatnio usunięte zadanie
          this._lastDeletedIndex = null; // Przechowuje indeks ostatnio usuniętego zadania
      },

      onAddTodo: function () {
    //Pobierz model
          var oModel = this.getView().getModel();
          var aTodos = oModel.getProperty("/todos");

    //Pobierz wartość z inputu
    var sNewTodoTitle = this.byId("newTodoInput").getValue();

    //Sprawdź czy input nie jest pusty
    if (!sNewTodoTitle){
      MessageBox.error("Wprowadź tytuł zadania");
      return;
    }

          // Utwórz nowe zadanie
          var newTodo = {
              id: aTodos.length + 1, // Proste generowanie ID
              title: sNewTodoTitle, // Użyj wartości z inputu
              completed: false
          };

          // Dodaj nowe zadanie do modelu
          aTodos.push(newTodo);
          oModel.setProperty("/todos", aTodos);

    //Wyczyść input
    this.byId("newTodoInput").setValue("");

          MessageToast.show("Dodano nowe zadanie");
      },

      onSelectionChange: function (oEvent) {
          var oSelectedItem = oEvent.getParameter("listItem");
          var sPath = oSelectedItem.getBindingContext().getPath();
          var oDialog = this.byId("editDialog");

          if (!oDialog) {
              oDialog = sap.ui.xmlfragment(this.getView().getId(), "zrobto.todo.view.EditDialog", this); 
              this.getView().addDependent(oDialog);
          }
          oDialog.bindElement(sPath);
          oDialog.open();
      },

      onSave: function () {
          this.byId("editDialog").close();
          MessageToast.show("Zapisano zmiany");
          this.byId("todoList").getBinding("items").refresh(); // Odśwież listę
      },

      onDelete: function () {
          var oDialog = this.byId("editDialog");
          var sPath = oDialog.getBindingContext().getPath();
          var oModel = this.getView().getModel();
          var aTodos = oModel.getProperty("/todos");
          var index = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));

          // Zapisz usunięte zadanie i jego indeks
          this._lastDeletedTodo = aTodos[index];
          this._lastDeletedIndex = index;

          // Usuń zadanie z tablicy
          aTodos.splice(index, 1);
          oModel.setProperty("/todos", aTodos);

          oDialog.close();
          MessageToast.show("Usunięto zadanie");
          this.byId("todoList").getBinding("items").refresh();

          // Pokaż przycisk "Cofnij"
          this.byId("undoButton").setVisible(true);
      },

      onCancel: function () {
          this.byId("editDialog").close();
      },

      onUndoDelete: function () {
          if (this._lastDeletedTodo) {
              var oModel = this.getView().getModel();
              var aTodos = oModel.getProperty("/todos");

              // Dodaj usunięte zadanie z powrotem na swoje miejsce
              aTodos.splice(this._lastDeletedIndex, 0, this._lastDeletedTodo);
              oModel.setProperty("/todos", aTodos);

              // Wyczyść zmienne przechowujące usunięte zadanie
              this._lastDeletedTodo = null;
              this._lastDeletedIndex = null;

              MessageToast.show("Przywrócono zadanie");
              this.byId("todoList").getBinding("items").refresh();

              // Ukryj przycisk "Cofnij"
              this.byId("undoButton").setVisible(false);
          }
      }
  });
});
