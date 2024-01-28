import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';

function DeleteModal({ show, setShow, navigate }: any) {
    const handleClose = () => {
        setShow({ show: false });
        navigate('/login');
        userdelete();
    };
    const handleCancle = () => {
        setShow({ show: false });
    };

    // 계정 탈퇴 요청
    const userdelete = async () => {
        try {
            const res = await axios({
                method: 'delete',
                url: '/mypage/deleteuser',
            });
            console.log('res.data >', res.data);
        } catch (err) {
            console.log('error >', err);
        }
    };
    return (
        <>
            {/* 변경 완료 되었을 시에 모달! */}
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header>
                    <Modal.Title style={{ color: 'red', fontWeight: 'bold' }}>
                        Warning!
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ fontWeight: 'bold' }}>
                    Are you absolutely certain you want to delete your account?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => {
                            handleCancle();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        style={{ backgroundColor: 'red', color: 'black' }}
                        variant="secondary"
                        onClick={() => {
                            handleClose();
                        }}
                    >
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default DeleteModal;