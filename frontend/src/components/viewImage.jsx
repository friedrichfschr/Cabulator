import { X } from 'lucide-react';
import React from 'react';

const ViewImage = ({ classes, src, alt }) => {
    const openModal = () => {
        const modal = document.getElementById("viewImageModal");
        modal.showModal();
        modal.querySelector("img").src = src;
        document.body.classList.add("modal-open");
    };

    const closeModal = () => {
        const modal = document.getElementById("viewImageModal");
        modal.close();
        document.body.classList.remove("modal-open");
    };

    return (
        <div>
            <img
                src={src}
                className={classes}
                alt={alt}
                onClick={openModal}
            />

            <dialog id="viewImageModal" className="modal">
                <div className="modal-box p-0">
                    <img src="" alt="View" className="w-full h-full object-contain" />
                    <button
                        className="absolute top-2 right-2 btn btn-sm btn-circle "
                        onClick={closeModal}
                    >
                        <X size={18} />
                    </button>
                </div>
                <form method="dialog" className="modal-backdrop" onClick={closeModal}>
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default ViewImage;