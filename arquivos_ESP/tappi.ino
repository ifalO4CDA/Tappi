#include <Wire.h>
#include <U8g2lib.h>
#include <Adafruit_PN532.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h> // Incluído para HTTPS
#include <ArduinoJson.h>

// --- CONFIGURAÇÕES DO USUÁRIO ---
const char* ssid = "Budweiser";
const char* password = "123123123";

const char* api_base_url = "https://tappi.jogajunto.tech"; 

// Impressão digital SHA1 do certificado do Tappi.
// const char* fingerprint = "0D 4D 9E 0C 1D A1 D3 42 16 9B 67 6D 1D 78 37 86 FC AB 4F 49";
const char* fingerprint = "D9 82 EC 09 A6 13 38 B2 DD AE 0C 27 30 FE 54 0B C4 3F B1 78";

// --- OBJETOS DOS DISPOSITIVOS ---
U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, /* reset=*/ U8X8_PIN_NONE);
Adafruit_PN532 nfc(-1, -1);

void displayMessage(const char* line1, const char* line2 = "", int delay_ms = 1000) {
    u8g2.clearBuffer();
    u8g2.setFont(u8g2_font_ncenB10_tr);
    
    int16_t x1 = (u8g2.getDisplayWidth() - u8g2.getStrWidth(line1)) / 2;
    u8g2.drawStr(x1, 25, line1);

    if (strlen(line2) > 0) {
        u8g2.setFont(u8g2_font_7x13_tr); // Fonte menor para a segunda linha
        int16_t x2 = (u8g2.getDisplayWidth() - u8g2.getStrWidth(line2)) / 2;
        u8g2.drawStr(x2, 50, line2);
    }
    
    u8g2.sendBuffer();
    if (delay_ms > 0) delay(delay_ms);
}

void setup(void) {
    Serial.begin(115200);
    u8g2.begin();
    nfc.begin();
    
    displayMessage("Conectando...", ssid);
    WiFi.begin(ssid, password);
    
    int timeout_counter = 0;
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        timeout_counter++;
        if (timeout_counter >= 30) {
            displayMessage("Falha no WiFi!", "", 0);
            while(1);
        }
    }

    displayMessage("Conectado!", WiFi.localIP().toString().c_str(), 2000);
    
    uint32_t versiondata = nfc.getFirmwareVersion();
    if (!versiondata) {
        displayMessage("Erro Leitor NFC!", "", 0);
        while (1);
    }
    nfc.SAMConfig();
    
    displayMessage("Aproxime o", "cartao", 0);
}

void loop(void) {
    uint8_t success;
    uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };
    uint8_t uidLength;

    success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);

    if (success) {
        String rfid_tag = "";
        for (uint8_t i = 0; i < uidLength; i++) {
            char hex[3];
            sprintf(hex, "%02X", uid[i]);
            rfid_tag += hex;
        }

        displayMessage("Verificando...", rfid_tag.c_str());

        if (WiFi.status() == WL_CONNECTED) {
            // Cria um objeto BearSSL::WiFiClientSecure para a conexão HTTPS
            BearSSL::WiFiClientSecure client;
            
            // Define que o cliente deve usar a impressão digital para verificação
            client.setFingerprint(fingerprint);

            HTTPClient http;

            String url = String(api_base_url) + "/api/passageiro/presenca";

            // Inicia a conexão segura passando o objeto client seguro
            if (http.begin(client, url)) {

                http.addHeader("Content-Type", "application/json");

                // Criação da string JSON manualmente
                String jsonPayload = "{\"rfid_tag\": \"" + rfid_tag + "\"}";

                // Envia a requisição POST com o corpo JSON
                int httpResponseCode = http.POST(jsonPayload);

                // Trata as respostas da API baseado no código de status
                if (httpResponseCode == 201) {
                    String payload = http.getString();
                    StaticJsonDocument<128> doc;
                    deserializeJson(doc, payload);
                    const char* nome = doc["mensagem"];
                    
                    displayMessage("Bem-vindo(a)!", "", 800);
                    displayMessage(nome, "", 2500);
                    
                } else if (httpResponseCode == 403) {
                    displayMessage("Acesso Negado!", "", 2000);
                    
                } else if (httpResponseCode == 404) {
                    displayMessage("cartao nao", "cadastrado", 2000);
                    
                } else {
                    displayMessage("Erro no Envio", String("HTTP: " + String(httpResponseCode)).c_str(), 2000);
                }

                http.end(); // Libera os recursos
            } else {
                displayMessage("Falha conexao", "HTTPS", 2000);
            }

        } else {
            displayMessage("Erro WiFi!", "Sem Conexao", 2000);
        }
        
        delay(4000);
        displayMessage("Aproxime o", "cartao", 0);
    }
}