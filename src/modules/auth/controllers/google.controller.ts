import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { GoogleAuthGuard } from "../guards/google.guard";
import { GoogleService } from "../services/google.service";

@Controller('google')
export class GoogleController {
    constructor(private googleService: GoogleService){}

    @Get()
    @UseGuards(GoogleAuthGuard)
    async googleAuth(@Req() req){}


    @Get('redirect')
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirect(@Req() req){
        return await this.googleService.loginWithGoogle(req);
    }

}