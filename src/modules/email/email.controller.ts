import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { MailerService } from '@nestjs-modules/mailer';
import { config } from "dotenv";

config();

@Controller('email')
export class EmailController {
    constructor(private mailService: MailerService){}

    @Get('plain-text-email')
    async plainTextEmail(@Query('toemail') toemail){
        await this.mailService.sendMail({
            to: toemail,
            from: process.env.SMTP_USER,
            subject: 'Simple Plain Text ',
            text: 'Welcome to nestjs email demo'
        })

        return 'success';
    }


    @Post('html-email')
    async postHtmlEmail(@Body() payload){
        await this.mailService.sendMail({
            to: payload.toemail,
            from: process.env.SMTP_USER,
            subject: payload.subject,
            template: 'superhero',
            context: {
                superHero:payload
            }
        });

        return "success";
    }
}