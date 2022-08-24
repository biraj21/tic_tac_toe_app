package com.foxdebug.tictactoe

import android.annotation.SuppressLint
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.webkit.ConsoleMessage
import android.webkit.WebChromeClient
import android.webkit.WebView

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        supportActionBar!!.hide()

        webView = findViewById(R.id.webView)
        webView.settings.allowFileAccessFromFileURLs = true
        webView.settings.javaScriptEnabled = true
        webView.webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(consoleMessage: ConsoleMessage): Boolean {
                Log.e(
                    "js error",
                    "Line " + consoleMessage.lineNumber() + ": " + consoleMessage.message()
                )
                return false
            }

            override fun onCloseWindow(webView: WebView) {
                finish()
            }
        }
        webView.loadUrl("file:///android_asset/www/index.html")
    }

    override fun onBackPressed() {
        webView.evaluateJavascript("(() => window.dispatchEvent(backPressedEvent))();", null)
    }
}
