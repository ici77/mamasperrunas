package com.mp.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "amazon")
public class AmazonProperties {

    private String accessKey;
    private String secretKey;
    private String associateTag;

    // Getters y Setters
    public String getAccessKey() {
        return accessKey;
    }

    public void setAccessKey(String accessKey) {
        this.accessKey = accessKey;
    }

    public String getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    public String getAssociateTag() {
        return associateTag;
    }

    public void setAssociateTag(String associateTag) {
        this.associateTag = associateTag;
    }
}
