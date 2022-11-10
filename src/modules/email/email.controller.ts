import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { MailerService } from '@nestjs-modules/mailer';
import { config } from "dotenv";

config();

@Controller('email')
export class EmailController {
    constructor(private mailService: MailerService){}


    @Post('html-email')
    async postHtmlEmail(@Body() payload){
        let result = await this.mailService.sendMail({
            to: payload.toemail,
            from: process.env.SMTP_USER,
            subject: payload.subject,
            template: 'superhero',
            context: {
                superHero:payload
            }
        });

        return result;
    }
}