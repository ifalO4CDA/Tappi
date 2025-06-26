# 🚌 Tappi - Sistema de Gestão de Presença e Autorização

## 📄 Sobre o Projeto

**Tappi** é uma solução  baseada em IoT para modernizar o controle de embarque de passageiros em autocarros. O sistema substitui o processo manual de verificação por uma abordagem automatizada, composta por um dispositivo de leitura NFC e uma plataforma web integrada, que permite a gestão e visualização de dados em tempo real.

O principal objetivo é aumentar a eficiência nos embarques, garantir a segurança dos passageiros autorizados e fornecer informações valiosas para a análise de fluxo e otimização do serviço.

---

## ✨ Funcionalidades

### 🔧 Back-end (API)

- **API RESTful** desenvolvida com Node.js e Express.  
- **Autenticação via JWT** para segurança no acesso ao dashboard.  
- **CRUD completo** para gestão de passageiros.  
- **Endpoint otimizado** para receber registos de presença enviados pelo hardware.  
- **Notificações em tempo real** com WebSockets.  
- **Paginação** em todas as listagens para garantir performance.

### 🖥️ Front-end (Dashboard)

- **Painel administrativo** para gestão de passageiros e visualização de dados.  
- **Modais interativos** para adicionar, editar e eliminar passageiros.  
- **Histórico de embarques** com paginação.  
- **Interface responsiva**, adaptável a diferentes tamanhos de ecrã.  
- **Toasts de notificação** para novas presenças registadas.

### 📟 Hardware (ESP8266 com Leitor NFC)

- **Leitura de TAGs NFC/RFID** para identificação dos passageiros.  
- **Comunicação segura via HTTPS** com a API.  
- **Display OLED** com feedback instantâneo sobre o resultado da leitura.

---

## 🚀 Tecnologias Utilizadas

| Categoria      | Tecnologias Principais              |
|----------------|-------------------------------------|
| **Back-end**   | Node.js, Express, Sequelize         |
| **Base de Dados** | PostgreSQL                         |
| **Front-end**  | HTML, CSS, JavaScript (vanilla)     |
| **Hardware**   | ESP8266, Leitor NFC, Display OLED   |
| **DevOps**     | Docker, Docker Compose              |

---

### 🔧 Código do Hardware (ESP8266)
O firmware do dispositivo encontra-se em:

arquivos_ESP/tappi.ino

📌 Instruções:
- Abra o arquivo na Arduino IDE.

- Instale as bibliotecas indicadas no topo do código.

- Configure o SSID e senha do seu Wi-Fi.

- Faça o upload para a sua placa ESP8266.

### Acesse o site 
https://tappi.jogajunto.tech/