import {WaitLinkStatus} from "../../../helpers/api";
import "./style.css";
import {useEffect, useState} from "react";
import {getRandomString} from "../../../helpers/format";

interface StatusProps {
    status: WaitLinkStatus
    title: string
    message: string
    showFakeLink: boolean
}

export const Status = ({status, title, message, showFakeLink}: StatusProps) => {
    const [fakeLink, setFakeLink] = useState("")

    useEffect(() => {
        let interval: any = null
        interval = setInterval(() => {
            if(status > WaitLinkStatus.Pending || !showFakeLink){
                clearInterval(interval)
                return
            }
            setFakeLink("Готовим ссылку https://" + getRandomString(7) + "/" + getRandomString(10))
        }, 75)
    })
    return (
        <div className={"status status-" + WaitLinkStatus[status].toLowerCase()}>
            <span className="status-icon">
                {status === WaitLinkStatus.Success && <img src="/img/done.svg" alt=""/>}
                {status === WaitLinkStatus.Error && <img src="/img/error.svg" alt=""/>}
            </span>
            <span className="status-text">
                {/*<span className="status-title">{title}</span>*/}
                { showFakeLink && <span className="status-message fake">{fakeLink}</span>}
                { !showFakeLink && <span className="status-message">{message}</span>}

            </span>
        </div>
    );
};