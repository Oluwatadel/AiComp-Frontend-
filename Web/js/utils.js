/**
 * Initializes a modal popup with success and error states that closes automatically after 3 seconds.
 * @param {boolean} isSuccess - Determines whether to show a success or error modal.
 * @param {string} message - The message to display in the modal.
 */
export function showModal(isSuccess, message) {
    // Create the modal container
    //const modal = document.createElement("div");
    // modal.className = "modal";
    // modal.style.display = "flex";
    // modal.width

    // // Modal content with icons
    // modal.innerHTML = `
    //     <div class="modal-content">
    //         <div class="modal-body">
    //             <span class="icon">
    //                 ${
    //                     isSuccess
    //                         ? '<i class="fa fa-check-circle success-icon"></i>'
    //                         : '<i class="fa fa-times-circle error-icon"></i>'
    //                 }
    //             </span>
    //             <p class="message">${message}</p>
    //         </div>
    //     </div>
    // `;

    // // Add modal to the document
    // document.body.appendChild(modal);

    // // Auto-close the modal after 3 seconds
    // setTimeout(() => {
    //     modal.style.display = "none";
    //     document.body.removeChild(modal);
    // }, 6000); // 3000ms = 3 seconds
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: isSuccess ? 'Success!' : 'Oops...',
            text: message,
            icon: isSuccess ? 'success' : 'error',
            confirmButtonText: 'OK',
            timer: 3000,  // Closes after 5 seconds automatically
            timerProgressBar: true,
        });

        // Delay the disappearance by another 2 seconds after it's shown
        setTimeout(() => {
            Swal.close(); // This manually closes the modal after a delay
        }, 3000);
    }    
}

