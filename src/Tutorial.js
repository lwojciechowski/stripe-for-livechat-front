/**@jsx jsx */
import React from "react";
import { css, jsx } from "@emotion/core";

const containerCss = css`
    margin: auto;
    max-width: 1000px;
    padding: 10px;
    
    .toc {
        background: #eee;
        border: 1px solid #ccc;
        padding: 10px;
        border-radius: 10px;
        max-width: 400px;
        
        li {
            line-height: 1.5em;
        }
    }
       
    ol li {
        line-height: 1.3em; 
    }
    h2 {
        margin-top: 3em;
    }
    
    p.warning {
        background-color: #efada0;
        padding: 15px;
        border: 1px solid #771c09;
        border-radius: 10px;
        
    }
`

const Tutorial = () => {
    return(
        <div css={containerCss}>
            <h1>Stripe for LiveChat - Manual</h1>
            <div className="toc">
                <ol>
                    <li><a href="#install">Connect to Stripe</a></li>
                    <li><a href="#uninstall">Disconnect from Stripe</a></li>
                </ol>
            </div>

            <section id="install">
                <h2>Connect to Stripe</h2>
                <p>To connect the application with Stripe acount you need to go through following steps:</p>
                <ol>
                    <li>Go to <a href="https://my.livechatinc.com">Agent Application</a></li>
                    <li>Go to <em>Settings</em> > <em>Integrations & apps</em> > <em>Explore Marketplace</em> > <em>Installed Apps</em></li>
                    <li>Select <em>Settings</em> for <em>Stripe</em> application</li>
                    <li>Click <em>Connect</em> and grant permissions to the application</li>
                </ol>
            </section>

            <section id="uninstall">
                <h2>Disconnect from Stripe</h2>
                <p>To disconnect the application from Stripe account you need to follow those steps:</p>
                <ol>
                    <li>Go to <a href="https://my.livechatinc.com">Agent Application</a></li>
                    <li>Go to <em>Settings</em> > <em>Integrations & apps</em> > <em>Explore Marketplace</em> > <em>Installed Apps</em></li>
                    <li>Select <em>Settings</em> for <em>Stripe</em> application</li>
                    <li>Click <em>Disconnect</em> and confirm</li>
                </ol>
                <p className="warning">
                    When you disconnect the Stripe account, you lose all matching from Stripe to LiveChat.
                    We treat your privacy very seriously and will remove all the data associated with your
                    Stripe account when you disconnect.
                </p>
            </section>
        </div>
    );
}

export default Tutorial;