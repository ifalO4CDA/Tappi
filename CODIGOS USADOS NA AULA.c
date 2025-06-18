0x3C

// testando l2c led
#include <Wire.h>

void setup() {
  Wire.begin();  // Inicializa a comunicação I2C
  Serial.begin(115200); // Inicializa a comunicação serial para exibir os resultados
}

void loop() {
  byte error, address;
  int numDevices = 0;

  Serial.println("\nI2C Scanner");
  Serial.println("Procurando dispositivos I2C...");

  for (address = 1; address < 127; address++) {
    Wire.beginTransmission(address);
    error = Wire.endTransmission();

    if (error == 0) {
      Serial.print("Dispositivo I2C encontrado no endereço 0x");
      if (address < 16) {
        Serial.print("0");
      }
      Serial.println(address, HEX);
      numDevices++;
    }
  }

  if (numDevices == 0) {
    Serial.println("Nenhum dispositivo I2C encontrado.");
  } else {
    Serial.print("Total de dispositivos encontrados: ");
    Serial.println(numDevices);
  }

  delay(5000); // Aguarda 5 segundos para realizar outra busca
}



// SCANNER NFC
#include <Wire.h>

void setup() {
  Wire.begin();
  Serial.begin(115200);
}

void loop() {
  byte error, address;
  int numDevices = 0;

  Serial.println("\nI2C Scanner");
  Serial.println("Procurando dispositivos I2C...");

  for (address = 1; address < 127; address++) {
    Wire.beginTransmission(address);
    error = Wire.endTransmission();

    if (error == 0) {
      Serial.print("Dispositivo I2C encontrado no endereço 0x");
      if (address < 16) {
        Serial.print("0");
      }
      Serial.println(address, HEX);
      numDevices++;
    }
  }

  if (numDevices == 0) {
    Serial.println("Nenhum dispositivo I2C encontrado.");
  } else {
    Serial.print("Total de dispositivos encontrados: ");
    Serial.println(numDevices);
  }
  delay(5000);
}

// Testando display OLED SSD1306 com U8g2
// HeLLO world
#include <Arduino.h>
#include <U8g2lib.h>
#include <Wire.h>

// Configuração para um display OLED SSD1306 128x64 em I2C.
// Esta é a configuração mais comum para o endereço 0x3C.
U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, /* reset=*/ U8X8_PIN_NONE);


void setup(void) {
  // Inicializa o display
  u8g2.begin();
}

void loop(void) {
  // Limpa a memória interna do display
  u8g2.clearBuffer();

  // Escolhe uma fonte
  u8g2.setFont(u8g2_font_ncenB14_tr);

  // Define a posição (coluna, linha) e escreve o texto
  u8g2.drawStr(0, 20, "Ola");
  u8g2.drawStr(0, 50, "Mundo!");
  
  // Envia o que está na memória para o display aparecer na tela
  u8g2.sendBuffer();
  
  delay(5000); // Espera 5 segundos
}



// PRINTANDO  // o UID de um cartão NFC usando a biblioteca Adafruit PN532
#include <Wire.h>
#include <Adafruit_PN532.h>

// Usa os pinos I2C padrão (D1, D2), não precisa mudar nada aqui.
Adafruit_PN532 nfc(1, 2);

void setup(void) {
  Serial.begin(115200);
  while (!Serial) delay(10); // Espera o Serial Monitor iniciar (importante para algumas placas)

  Serial.println("Inicializando leitor PN532...");

  nfc.begin();

  uint32_t versiondata = nfc.getFirmwareVersion();
  if (!versiondata) {
    Serial.print("Não foi possível encontrar a placa PN532. Verifique a fiação!");
    while (1); // Trava o código aqui se não encontrar o leitor
  }
  
  // Confirmação de que o leitor foi encontrado
  Serial.print("Encontrado chip PN5"); Serial.println((versiondata >> 24) & 0xFF, HEX);
  Serial.print("Versão do Firmware: "); Serial.print((versiondata >> 16) & 0xFF, DEC);
  Serial.print('.'); Serial.println((versiondata >> 8) & 0xFF, DEC);

  // Configura o leitor para ler tags Mifare (as mais comuns)
  nfc.SAMConfig();

  Serial.println("\nPronto! Aproxime um cartão ou tag NFC!");
  Serial.println("==========================================");
}

void loop(void) {
  uint8_t success;
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };  // Buffer para guardar o UID
  uint8_t uidLength;                        // Guarda o tamanho do UID em bytes

  // Tenta ler um cartão passivamente.
  // PN532_MIFARE_ISO14443A é o tipo de tag mais comum.
  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);

  if (success) {
    Serial.println("Sucesso! Um cartão foi detectado.");
    Serial.print("Tamanho do UID: "); Serial.print(uidLength); Serial.println(" bytes");
    Serial.print("UID (Serial do Cartão):");
    
    // Imprime o UID em formato hexadecimal, que é o padrão
    for (uint8_t i = 0; i < uidLength; i++) {
      if (uid[i] < 0x10) Serial.print(" 0"); // Adiciona um zero à esquerda se o número for menor que 16
      else Serial.print(" ");
      Serial.print(uid[i], HEX);
    }
    
    Serial.println("\n");
    Serial.println("Aproxime o próximo cartão...");
    Serial.println("==========================================");
    
    // Espera 1 segundo para não ficar lendo o mesmo cartão sem parar
    delay(1000);
  }
}



// MOSTRANDO O CÓDIGO DO CARTÃO NFC NO OLED
// --- BIBLIOTECAS NECESSÁRIAS ---
#include <Wire.h>
#include <U8g2lib.h>          // Para o Display OLED
#include <Adafruit_PN532.h>    // Para o Leitor NFC

// --- OBJETOS DOS DISPOSITIVOS ---
// Objeto para o Display (SSD1306 I2C, o mais comum para o endereço 0x3C)
U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, /* reset=*/ U8X8_PIN_NONE);

// Objeto para o Leitor NFC (usando I2C)
Adafruit_PN532 nfc(1, 2);


void setup(void) {
  // Inicializa o display primeiro para podermos mostrar mensagens de status
  u8g2.begin();
  u8g2.setFont(u8g2_font_ncenB08_tr); // Define uma fonte padrão
  u8g2.clearBuffer();
  u8g2.drawStr(0, 15, "Iniciando Leitor...");
  u8g2.sendBuffer();
  delay(1000);

  // Inicializa o leitor NFC
  nfc.begin();

  uint32_t versiondata = nfc.getFirmwareVersion();
  if (!versiondata) {
    // Se não encontrar o leitor, avisa no display
    u8g2.clearBuffer();
    u8g2.drawStr(0, 15, "Erro no Leitor!");
    u8g2.drawStr(0, 30, "Verifique a fiação");
    u8g2.sendBuffer();
    while (1); // Trava o programa aqui
  }

  // Configura o leitor para ler tags
  nfc.SAMConfig();

  // Mensagem de pronto no display
  u8g2.clearBuffer();
  u8g2.setFont(u8g2_font_ncenB10_tr);
  u8g2.drawStr(10, 35, "Aproxime a TAG");
  u8g2.sendBuffer();
}


void loop(void) {
  uint8_t success;
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };  // Buffer para guardar o UID
  uint8_t uidLength;                        // Guarda o tamanho do UID

  // Tenta ler um cartão
  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);

  if (success) {
    // --- TAG ENCONTRADA! ---
    
    // 1. Limpa a tela
    u8g2.clearBuffer();
    u8g2.setFont(u8g2_font_ncenB10_tr);
    u8g2.drawStr(0, 15, "TAG Detectada!");

    // 2. Formata o UID para poder ser impresso
    char uidString[30] = ""; // Cria uma string vazia
    for (uint8_t i = 0; i < uidLength; i++) {
      char hex[4];
      sprintf(hex, "%02X ", uid[i]); // Converte um byte para formato Hexadecimal (ex: 9A)
      strcat(uidString, hex);       // Adiciona o valor na string principal
    }

    // 3. Desenha o UID na tela
    u8g2.setFont(u8g2_font_courB10_tr); // Usa uma fonte monoespaçada para alinhar
    u8g2.drawStr(0, 45, uidString);

    // 4. Envia tudo para o display
    u8g2.sendBuffer();

    delay(3000); // Mostra o UID por 3 segundos

    // 5. Volta para a tela inicial
    u8g2.clearBuffer();
    u8g2.setFont(u8g2_font_ncenB10_tr);
    u8g2.drawStr(10, 35, "Aproxime a TAG");
    u8g2.sendBuffer();
  }
}