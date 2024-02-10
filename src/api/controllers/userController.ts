
import {userModel} from '../models/userModel';
import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import bcrypt from 'bcryptjs';
import {User, UserOutput} from '../../types/DBTypes';
import {
  MessageResponse,
  UploadResponse,
} from '../../types/MessageTypes';
import {validationResult} from 'express-validator';
const salt = bcrypt.genSaltSync(12);

const userListGet = async (
  _req: Request,
  res: Response<User[]>,
  next: NextFunction
) => {
  try {
    const errors = validationResult(_req);
    if (!errors.isEmpty()) {
      const messages: string = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      console.log('userListGet validation', messages);
      next(new CustomError(messages, 400));
      return;
    }
    const users = await userModel.find({});
    const _users: User[] = [];
    for (const user of users) {
      const _user = {
        _id: user._id,
        user_name: user.user_name,
        email: user.email,
      };
      _users.push(_user as User);
    }
    res.json(_users);
  } catch (error) {
    next(error);
  }
};

const userGet = async (
  req: Request<{id: User}>,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req.params.id);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('userGet validation', messages);
    next(new CustomError(messages, 400));
    return;
  }
  try {
    const user = await userModel.findById(req.params.id);
    const _user = {
      _id: user!._id,
      user_name: user!.user_name,
      email: user!.email,
    };
    res.json(_user);
  } catch (error) {
    next(error);
  }
};
const userPost = async (
  req: Request<{}, {}, User>,
  res: Response<UploadResponse>,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('user_post validation', messages);
    next(new CustomError(messages, 400));
    return;
  }
  try {
    const user = {
      user_name: req.body.user_name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, salt),
    };
    const result = await userModel.create(user);
    res.status(200).json({
      data: {
        _id: result?._id,
        user_name: result!.user_name,
        email: result!.email,
      },
      message: 'User created',
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

const userPutCurrent = async (
  req: Request<{}, {}, User>,
  res: Response<UploadResponse>,
  next: NextFunction
) => {
  const errors = validationResult(res.locals.user._id);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    next(new CustomError(messages, 400));
    return;
  }
  const user = req.body as User;
  console.log('userPutCurrent', user);
  try {
    const result = await userModel.findByIdAndUpdate(
      res.locals.user._id,
      user,
      {new: true}
    );
    res.json({
      data: {
        _id: result?._id,
        user_name: result!.user_name,
        email: result!.email,
      },
      message: 'User created',
    });
  } catch (error) {
    next(error);
  }
};

const userDelete = async (
  req: Request<{id: User}, {}, User>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  const errors = validationResult(req.params.id);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('userDelete validation', messages);
    next(new CustomError(messages, 400));
    return;
  }

  try {
    const result = await userModel.findByIdAndDelete(req.params.id);
    console.log('userDelete', result);
  } catch (error) {
    next(error);
  }
};

const userDeleteCurrent = async (
  req: Request,
  res: Response<UploadResponse>,
  next: NextFunction
) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('userDeleteCurrent validation', messages);
    next(new CustomError(messages, 400));
    return;
  }
  try {
    const result = await userModel.findByIdAndDelete(res.locals.user._id);
    res.json({
      data: {
        _id: result?._id,
        user_name: result!.user_name,
        email: result!.email,
      },
      message: 'User deleted',
    });
  } catch (error) {
    next(error);
  }
};

const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('userToken validation', messages);
    next(new CustomError(messages, 400));
    return;
  }

  try {
    const user = res.locals.user as UserOutput;
    const _user = {
      _id: user._id,
      user_name: user.user_name,
      email: user.email,
    };
    res.json(_user);
  } catch (error) {
    next(error);
  }
};

export {
  userListGet,
  userGet,
  userPost,
  userPutCurrent,
  userDelete,
  userDeleteCurrent,
  checkToken,
};
