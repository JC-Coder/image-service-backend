import { Injectable, Logger } from "@nestjs/common";
import { confirmPassword } from "src/interfaces/confirmPasswordEmail.interface";
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class EmailService{
    private logger = new Logger(EmailService.name)
    constructor(private mailService: MailerService){}
    
    async sendConfirmPassword(payload: confirmPassword){
        this.logger.log('sending reset password email');

        let result = await this.mailService.sendMail({
            to: payload.to,
            from: process.env.SMTP_USER,
            subject: 'Confirm Password',
            template: 'confirm-password',
            context: {
                confirmPassword: payload
            }
        });

        if(result.accepted){
            this.logger.log('email send success');
        } else {
            this.logger.debug('email not sent');
        }
    }
}