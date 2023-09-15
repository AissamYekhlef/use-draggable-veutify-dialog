import { useDraggableDialog } from "../composables/useDraggableDialog"
const { activateDraggableDialogs, deactivateDraggableDialogs } = useDraggableDialog()


export const draggableDialogMixin = {
    data() {
        return {
            draggableDialogId: null
        }
    },
    props: {
        draggable: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        activateDraggableDialogs() {
            if (this.draggable) {
              this.draggableDialogId = activateDraggableDialogs()
              return true
            }
            return false
          },
          deactivateDraggableDialogs() {
            if(this.draggable){
                deactivateDraggableDialogs(this.draggableDialogId);
                return true
            }
            return false
        }
    },

    /**
     * 
        add other hooks to update draggable status 
        example:

        mounted() {
            this.activateDraggableDialogs()
        },
        destroyed() {
            this.deactivateDraggableDialogs()
        }
    */
    
}