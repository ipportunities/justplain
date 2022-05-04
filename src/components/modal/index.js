import React, {useRef} from 'react';
import t from "../translate";

const Modal = (props) => {
    const childRef = useRef();
    const ContentComponent = props.component;
    return (
        <div className="modal fade" id={props.name} role="dialog" aria-labelledby={props.label} aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{props.title}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"  onClick={() => childRef.current.cancelHandler()}>
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <ContentComponent {...props.componentData} ref={childRef}/>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => childRef.current.cancelHandler()}>{t("Annuleer")}</button>
                        <button type="button" className="btn btn-primary" onClick={() => childRef.current.submitHandler()}>{props.btnValue}</button>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Modal;
