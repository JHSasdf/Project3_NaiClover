import { useState, useEffect } from 'react';
import '../../styles/AlertPageFollowAlert.scss';

interface TimeObject {
    year: string;
    month: string;
    date: string;
    day: string;
    hour: string;
    minute: string;
    second: string;
    howLong: string;
}

function FollowAlert(props: any) {
    const { alarmObj, validTime } = props;
    const [alarmClassName, setAlarmClassName] = useState(
        'monotalkalert-container'
    );
    const [timeObj, setTimeObj] = useState<TimeObject | null>(null);
    const getTimeObj = (input: string): TimeObject => {
        const time = new Date(input);
        const now = new Date();
        const gap: number = now.getTime() - time.getTime();
        const secondsLong: number = Math.floor(gap / 1000);
        let howLong;
        if (secondsLong < 60) {
            howLong = `${secondsLong}sec`;
        } else if (secondsLong >= 3600 * 24 * 30) {
            howLong = `${Math.floor(secondsLong / 2592000)}month`;
        } else if (secondsLong >= 3600 * 24) {
            howLong = `${Math.floor(secondsLong / 86400)}day`;
        } else if (secondsLong >= 3600) {
            howLong = `${Math.floor(secondsLong / 3600)}hour`;
        } else {
            howLong = `${Math.floor(secondsLong / 60)}min`;
        }
        let timeObj: TimeObject = {
            year: `${time.getFullYear()}`,
            month: `${time.getMonth() + 1}`,
            date: `${time.getDate()}`,
            day: `${time.getDay()}`,
            hour: `${time.getHours()}`,
            minute: `${time.getMinutes()}`,
            second: `${time.getSeconds()}`,
            howLong: howLong,
        };
        return timeObj;
    };

    useEffect(() => {
        setTimeObj(getTimeObj(alarmObj.createdAt));
        if (!validTime && alarmObj.checked) {
            setAlarmClassName('monotalkalert-oldcontainer');
        }
    }, []);

    return (
        <>
            <div className={alarmClassName}>
                <div className="followalert-title">
                    <span className="followalert-username">
                        {alarmObj.otherUserId}
                    </span>
                    님이 팔로우를 했습니다
                </div>
                <div>{timeObj?.howLong}</div>
            </div>
            <div className="bottom-line"></div>
        </>
    );
}

export default FollowAlert;
