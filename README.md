# Vue use vuetify draggable dialog

## About the package

the Vuetify dialogs by default are not draggable and you need to use external 3rd party to move (drag) dialogs  
  

## how to use it

just run and install it with: 

```bach
npm i use-draggable-vuetify-dialog
```
import it in your dialog component if it already exist

```js
import { useDraggableDialog } from  "use-draggable-vuetify-dialog"
const { activateDraggableDialogs, deactivateDraggableDialogs } = useDraggableDialog()
```

**activateDraggableDialogs:**   function returns a **uniqueId** to use it to close the last dialog


**deactivateDraggableDialogs:**   takes a param **uniqueId** to use it to close the last dialog

### example:
```js
let draggableDialogId = null

activateDraggableDialog() {
	draggableDialogId = activateDraggableDialogs()
	return  true
},

deactivateDraggableDialog() {
	deactivateDraggableDialogs(draggableDialogId);
	return  true
}
``` 
the last opened dialog only can close the draggable functionality
