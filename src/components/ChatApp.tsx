import { useEffect } from "react";
import { useWaitFor } from "../hooks/useWaitFor";

export default function ChatApp() {
    const isBootstrapAvailable = useWaitFor("embeddedservice_bootstrap")
    useEffect(() => {
        if (!isBootstrapAvailable) return;

        try {
            window.embeddedservice_bootstrap.settings.language = "en_US"; // For example, enter 'en' or 'en-US'

            window.embeddedservice_bootstrap.init(
                "00DSG00000LMo8X", // Test env org ID
                "MIAW", // Test env deployment name
                "https://dxx0000006gpleau.my.localhost.sfdcdev.site.com:6101/ESWMIAW1726260437846", // Local site URL
                {
                    scrt2URL:
                        "https://jeremyklukanesw.demo.test1.my.pc-rnd.salesforce-scrt.com", // Test env SCRT URL
                }
            );
        } catch (err) {
            console.error("Error loading Embedded Messaging: ", err);
        }
    }, [isBootstrapAvailable]);
    
    useEffect(() => {
        const scriptTag = document.createElement("script");
        scriptTag.setAttribute("type", "text/javascript");
        scriptTag.setAttribute(
            "src",
            "https://dxx0000006gpleau.my.localhost.sfdcdev.site.com:6101/ESWMIAW1726260437846/assets/js/bootstrap.min.js"
        );
        document.head.appendChild(scriptTag);
    }, []);

    return <></>;
}
