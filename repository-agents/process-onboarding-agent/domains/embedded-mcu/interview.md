# Domain Pack: Embedded MCU — Interview

Covers bare-metal and RTOS firmware on microcontrollers. Used by the Domain Overlay (`process-onboarding-agent/setup-guide.md`) in place of Questions 2–8 of the base Fresh Project — Structured Interview. Question 1 (Product identity) and Question 9 (Documentation archive threshold) are asked generically once, regardless of domain — do not repeat them here.

**Mature project usage:** for a Mature project, do not ask these as interview questions. Instead, use them as the categories to extract during Phase M1 (Architecture Mapping and Pattern Extraction) for any segment identified as MCU firmware — read the existing code to answer each one rather than asking the engineer, and confirm your findings with them before writing them into the master rule file.

Ask one question at a time. Wait for each answer before continuing. Do not skip questions.

---

**MCU-1 (fills interview slot Question 2) — Target hardware & firmware stack**

> "What MCU or SoC family is this running on (e.g. STM32F4, ESP32-S3, nRF52840, RP2040)? Bare-metal or an RTOS — and if an RTOS, which one (FreeRTOS, Zephyr, ThreadX, embOS, SafeRTOS, other)? What toolchain and build system (GCC ARM Embedded, IAR, Keil, ESP-IDF, Zephyr's build system; CMake, Make, PlatformIO, or the vendor IDE's own project format)?"

Record whether the project is **bare-metal** or **RTOS**. If RTOS, record the RTOS name — this determines whether `rules/rtos-design-rules.md` is installed later (Domain Overlay step 3).

---

**MCU-2 (fills interview slot Question 3) — Real-time, power & resource budget**

> "What are the hard or soft real-time deadlines this firmware must meet (e.g. control loop rate, interrupt response latency)? What is the power budget (active current target, sleep/standby modes required, battery life target if battery-powered)? What is the memory budget — flash size and RAM size available, and how much margin do you want reserved for growth?"

---

**MCU-3 (fills interview slot Question 4) — Communication interfaces & external systems**

> "What does this device talk to, and over what protocol — a host PC (USB/UART), another board (SPI/I2C/CAN), a phone or gateway (BLE/Wi-Fi), a cloud service (MQTT/HTTPS over Wi-Fi or cellular), or a sensor/actuator bus? List each interface and what's on the other end."

---

**MCU-4 (fills interview slot Question 5) — Persistent storage, provisioning & the hardware/software boundary**

> "What does this device persist, and where — internal flash, external SPI/QSPI flash, EEPROM, SD card? Is there a filesystem (LittleFS, FatFS) or raw sector access? Does the device need a unique identity for provisioning (serial number, certificate, secure element)?
>
> Are there any hard rules about what must never happen at the hardware/software boundary — for example: the watchdog must never be disabled without sign-off, a blocking HAL call must never be made from an ISR, a flash write must never happen from interrupt context, or a peripheral must never be left in an undefined state on an error path?"

Capture the "must never happen" rules verbatim — these become Section 3 hard-stops in the master rule file addition (see `master-rule-additions.md`).

---

**MCU-5 (fills interview slot Question 6) — Domain language**

> "List the key terms this system's domain uses — signal names, fault codes, operating modes, calibration terms, anything a new firmware engineer would need defined. For each, a one-sentence definition. (e.g. 'Setpoint — the target value a control loop is driving toward'; 'Fault-latched — a fault state that persists until an explicit clear, even if the triggering condition clears itself.')"
>
> *Keep asking "any more?" until the engineer says done.*

---

**MCU-6 (fills interview slot Question 7) — Known constraints and prohibitions**

> "Are there any firmware choices already decided that must not be changed by the AI? (e.g. 'must use the vendor HAL, not register-level access', 'no dynamic allocation after system init', 'MISRA C:2012 mandatory/required rules apply to all new code', 'this driver was independently verified and must not be modified without sign-off'.)"

---

**MCU-7 (fills interview slot Question 8) — First capability**

> "What is the first firmware capability you want to build? Give it a name and one sentence describing what it does — e.g. 'Sensor sampling loop — reads the IMU at 100Hz and pushes readings to the processing queue.'"

---

After all seven questions are answered, hand the recorded answers to the Domain Overlay's remaining steps: they populate the Hardware Profile subsection of Section 1, the hard-stops in Section 3, and the first intent file, exactly as the base Fresh interview's answers do for Questions 2–8.
