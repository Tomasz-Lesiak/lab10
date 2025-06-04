import  UserModel  from '../schemas/user.schema';
import {IUser} from "../models/user.model";
import nodemailer from 'nodemailer';

class UserService {
   public async createNewOrUpdate(user: IUser) {
   
       try {
           if (!user._id) {
               const dataModel = new UserModel(user);
               return await dataModel.save();
           } else {
               return await UserModel.findByIdAndUpdate(user._id, { $set: user }, { new: true });
           }
       } catch (error) {
           console.error('Wystąpił błąd podczas tworzenia danych:', error);
           throw new Error('Wystąpił błąd podczas tworzenia danych');
       }
   }

   public async getByEmailOrName(name: string) {
       try {
           const result = await UserModel.findOne({ $or: [{ email: name }, { name: name }] });
           if (result) {
               return result;
           }
       } catch (error) {
           console.error('Wystąpił błąd podczas pobierania danych:', error);
           throw new Error('Wystąpił błąd podczas pobierania danych');
       }
   }

   public async sendResetEmail(email: string, newPassword: string): Promise<void> {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'MAIL UŻYTKOWNIKA',
                pass: 'HASŁO APLIKACJI Z GMAILA'
            }
        });

        const mailOptions = {
            from: '"IoT App" <MAIL UŻYTKOWNIKA>',
            to: email,
            subject: 'Reset Twojego hasła',
            text: `Twoje nowe hasło: ${newPassword}`
        };

        await transporter.sendMail(mailOptions);
    }

    public async getAll() {
        try {
            return await UserModel.find({});
        } catch (error) {
            console.error('Wystąpił błąd podczas pobierania wszystkich użytkowników:', error);
            throw new Error('Wystąpił błąd podczas pobierania wszystkich użytkowników');
        }
    }
}

export default UserService;