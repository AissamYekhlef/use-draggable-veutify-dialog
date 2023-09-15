
export function useDraggableDialog () {
   
    /**
     * inspired by https://github.com/NMFES/vuetify-multiple-draggable-dialogs
     */

    const container = {};
    const wrappersSelector = '.v-dialog__content.v-dialog__content--active';
    const dialogSelector = '.v-dialog.v-dialog--active';

    /**
     * Find the closest dialog
     * @param event
     */
    function closestDialog(event) {
        // check for left click
        if (event.button !== 0) {
            return;
        }

        let dialog;
        // target must contain one of provided classes
        ['v-card__title', 'v-toolbar__content', 'v-toolbar__title'].forEach((className) => {
            if (event.target.classList.contains(className)) {
                dialog = event.target.closest(dialogSelector);
            }
        });

        return dialog
    }

    /**
     * Make current dialog above the rest by switching their z-indexes
     * @param event
     */
    function makeDialogAbove(event) {
        const wrappers = document.querySelectorAll(wrappersSelector);
        const activeWrapper = event.target.closest(wrappersSelector);
        // if we clicked on non-related element
        if (!activeWrapper) {
            return false;
        }

        // list of all z-indexes of wrappers
        let indexes = [];
        // collect all the indexes
        wrappers.forEach((element) => {
            indexes.push(parseInt(element.style.zIndex));
        });

        const maxIndex = Math.max(...indexes);
        const currentIndex = parseInt(activeWrapper.style.zIndex);
        // if z-index of current active dialog is less than we will switch them
        // to make this dialog above the rest
        if (currentIndex < maxIndex) {
            wrappers.forEach((element) => {
                if (parseInt(element.style.zIndex) === maxIndex) {
                    element.style.zIndex = currentIndex.toString();
                    activeWrapper.style.zIndex = maxIndex.toString();
                }
            });
        }
    }

    /**
     * Assign main styles
     * @param event
     */
    function setStyles(event) {
        const dialog = closestDialog(event);

        if (dialog) {
            container.el = dialog;
            container.mouseStartX = event.clientX;
            container.mouseStartY = event.clientY;
            container.elStartX = container.el.getBoundingClientRect().left;
            container.elStartY = container.el.getBoundingClientRect().top;
            container.el.style.position = 'fixed';
            container.el.style.margin = '0px';
            container.oldTransition = container.el.style.transition;
            container.el.style.transition = 'none';
        }
    }

    /**
     * Prevent out of bounds
     */
    function alignDialog() {
        const dialog = document.querySelector(dialogSelector);
        if (dialog === null) return;

        const styleLeft = parseInt(dialog.style.left);
        const styleTop = parseInt(dialog.style.top);
        const boundingWidth = dialog.getBoundingClientRect().width;
        const boundingHeight = dialog.getBoundingClientRect().height;

        const left = Math.min(styleLeft, window.innerWidth - boundingWidth);
        const top = Math.min(styleTop, window.innerHeight - boundingHeight);

        let borderLeft = 0;
        let borderTop = 0;

        // we need to add some borders to center the dialog once the window has resized
        if (styleLeft > window.innerWidth) {
            borderLeft = left / 2;
        }

        if (styleTop + boundingHeight > window.innerHeight) {
            borderTop = (window.innerHeight - boundingHeight) / 2;
        }

        dialog.style.left = (left - borderLeft) + 'px';
        dialog.style.top = (top - borderTop) + 'px';
    }


    /**
     * Move the dialog by mouse cursor
     * @param event
     */
    function moveDialog(event) {
        if (container.el) {
            container.el.style.left = Math.min(
                Math.max(container.elStartX + event.clientX - container.mouseStartX, 0),
                window.innerWidth - container.el.getBoundingClientRect().width
            ) + 'px';

            container.el.style.top = Math.min(
                Math.max(container.elStartY + event.clientY - container.mouseStartY, 0),
                window.innerHeight - container.el.getBoundingClientRect().height
            ) + 'px';
        }
    }

    /**
     * Return the initial transition
     * @param event
     */
    function setTransitionBack(event) {
        if (container.el) {
            container.el.style.transition = container.oldTransition;
            container.el = undefined;
        }
    }

    const randomId = function(length = 10) {
        return Math.random().toString(36).substring(2, length+2);
    };


    const mouseDownEventHandler = (event) => {
        makeDialogAbove(event);
        setStyles(event);
    }

    const mouseMoveEventHandler = (event) => {
        moveDialog(event);
    }
    const mouseUpEventHandler = (event) => {
        setTransitionBack(event);
    }

    let draggableEventRegistered = false
    let currentOpeningDialog = null 

    const toggleDraggableFlag = () => {
        draggableEventRegistered = !draggableEventRegistered;
    }


    return {
        activateDraggableDialogs() {
            if (draggableEventRegistered || currentOpeningDialog !== null) {
                return null
            }
            
            // use unique id for the opened dialog, only that id can close the current listeners
            const dialogId = randomId()
            
            document.addEventListener('mousedown', mouseDownEventHandler);
            document.addEventListener('mousemove', mouseMoveEventHandler);
            document.addEventListener('mouseup', mouseUpEventHandler);

            setInterval(() => {
                alignDialog();
            }, 500);

            toggleDraggableFlag()
            currentOpeningDialog = dialogId 
            return dialogId
        },
        deactivateDraggableDialogs(dialogId) {
            // only the same opening didata-dialog could remove event listeners 
            if (!draggableEventRegistered || dialogId !== currentOpeningDialog) {
                return false
            }

            document.removeEventListener('mousedown', mouseDownEventHandler);
            document.removeEventListener('mousemove', mouseMoveEventHandler);
            document.removeEventListener('mouseup', mouseUpEventHandler);

            toggleDraggableFlag()
            currentOpeningDialog = null
            return true
        },
    }
}
