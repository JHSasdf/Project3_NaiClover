import { Request, Response, NextFunction } from 'express';
import { db } from '../model';
import { Op } from 'sequelize';
const User = db.User;
const Lang = db.Lang;
const Room = db.Room;
const Chat = db.Chat;

// room 보여주는 홈페이지에서 1:1 채팅방 목록 보여주는 함수
export const getPersonalRooms = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userid = req.session.userid;
    if (!userid || userid.length < 4) {
        return res.status(401).json({
            msg: 'Please Login First!',
            isError: true,
        });
    }

    let results;
    try {
        results = await Room.findAll({
            where: {
                [Op.or]: [{ userid: userid }, { useridTo: userid }],
                [Op.not]: [{ useridTo: 'monoChat' }],
            },
            include: [
                {
                    model: Chat,
                    order: [['createdAt', 'DESC']],
                    limit: 1,
                },
            ],
        });
        for (const result of results) {
            const existingUserid = await User.findOne({
                where: { userid: result.dataValues.userid },
                attributes: ['name', 'nation', 'profileImgPath'],
            });

            const existingUseridTo = await User.findOne({
                where: { userid: result.dataValues.useridTo },
                attributes: ['name', 'nation', 'profileImgPath'],
            });

            const myUserNameData = await User.findOne({
                where: { userid: userid },
                attributes: ['name', 'nation', 'profileImgPath'],
            });
            const myUserName = myUserNameData.dataValues.name;

            const existingArr = [
                existingUserid.dataValues,
                existingUseridTo.dataValues,
            ];

            const final = existingArr.filter((elem) => {
                return elem.name !== myUserName;
            });
            result.dataValues.realRoomName = final;
        }
    } catch (err) {
        return next(err);
    }

    // personalRooms.realRoomName이 1:1 채팅에서 상대방의 이름
    res.json({
        personalRooms: results,
        isError: false,
    });
};

// room 보여주는 홈페이지에서 모노 채팅방 목록 보여주는 함수
export const getMonoRooms = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userid = req.session.userid;
    if (!userid || userid.length < 4) {
        return res.status(401).json({
            msg: 'Please Login First!',
            isError: true,
        });
    }

    let result;
    try {
        result = await Room.findAll({
            where: {
                useridTo: 'monoChat',
            },
        });
    } catch (err) {
        return next(err);
    }
    res.json({
        monoRooms: result,
        isError: false,
    });
};

export const getChatLog = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const roomNum = req.params.id;
    try {
        const result = await Chat.findAll({
            where: { roomNum: roomNum },
            include: [
                {
                    model: User,
                    attributes: ['profileImgPath', 'name'],
                },
            ],
        });

        res.json({ chatLog: result });
    } catch (err) {
        return next(err);
    }
};
