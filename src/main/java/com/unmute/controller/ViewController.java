package com.unmute.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @GetMapping("/signup")
    public String signupPage() {
        return "signup";
    }

    @GetMapping("/listener-login")
    public String listenerLogin() {
        return "listener-login";
    }

    @GetMapping("/listener-signup")
    public String listenerSignup() {
        return "listener-signup";
    }

    @GetMapping("/speaker-entry")
    public String speakerEntry() {
        return "speaker-entry";
    }

    @GetMapping("/connect-session")
    public String connectSession() {
        return "connect-session";
    }

    @GetMapping("/account-settings-listener")
    public String listenerSettings() {
        return "account-settings-listener";
    }

    @GetMapping("/account-settings-speaker")
    public String speakerSettings() {
        return "account-settings-speaker";
    }

    @GetMapping("/")
    public String index() {
        return "index";
    }
}
