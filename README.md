# Elden Ring Armor Optimizer

This is an Elden Ring armor optimizer tool built with Node.js and TypeScript. It helps you find the best armor combinations in the game based on your desired stats, equip load, roll type, and availability (base game or DLC).

## Installation

1. **Prerequisites:** Make sure you have Node.js and npm installed.
2. **Clone the repository:**

    ```bash
    git clone <repository URL>
    ```

3. **Install dependencies:**

    ```bash
    cd <repository name>
    npm install
    ```

4. **Create the `armorData.json` file**
    Create a json file named `armorData.json` and add all armor data to it. (Can be gathered from the tables of [this page](https://eldenring.wiki.fextralife.com/Armor))
    Example for the content of the file:

    ```json
    {
      "helms": [
        {
          "name": "Greathelm",
          "weight": 5.5,
          "available": "Base Game",
          "poise": 8,
          "phy": 4.8,
          "vsStrike": 4.2,
          "vsSlash": 5.0,
          "vsPierce": 4.6,
          "magic": 3.8,
          "fire": 4.6,
          "ligt": 3.6,
          "holy": 4.0,
          "immunity": 18,
          "robustness": 28,
          "focus": 12,
          "vitality": 13
        },
        {
          "name": "Imp Head (Fanged)",
          "weight": 3.5,
          "available": "Shadow of the Erdtree DLC",
          "poise": 4,
          "phy": 3.5,
          "vsStrike": 4.0,
          "vsSlash": 2.9,
          "vsPierce": 3.3,
          "magic": 4.5,
          "fire": 4.2,
          "ligt": 4.8,
          "holy": 4.6,
          "immunity": 32,
          "robustness": 12,
          "focus": 21,
          "vitality": 21
        }
      ],
      "chests": [
        {
          "name": "Blaidd's Armor",
          "weight": 10.5,
          "available": "Base Game",
          "poise": 28,
          "phy": 12.8,
          "vsStrike": 11.4,
          "vsSlash": 13.3,
          "vsPierce": 12.4,
          "magic": 9.0,
          "fire": 11.9,
          "ligt": 8.8,
          "holy": 9.5,
          "immunity": 42,
          "robustness": 66,
          "focus": 28,
          "vitality": 31
        },
        {
          "name": "Rakshasa Armor",
          "weight": 8.5,
          "available": "Shadow of the Erdtree DLC",
          "poise": 18,
          "phy": 10.5,
          "vsStrike": 11.0,
          "vsSlash": 8.5,
          "vsPierce": 9.5,
          "magic": 12.5,
          "fire": 12.0,
          "ligt": 13.0,
          "holy": 12.5,
          "immunity": 60,
          "robustness": 35,
          "focus": 55,
          "vitality": 55
        }
      ],
      "gauntlets": [
        {
          "name": "Blaidd's Gauntlets",
          "weight": 3.5,
          "available": "Base Game",
          "poise": 7,
          "phy": 3.2,
          "vsStrike": 2.8,
          "vsSlash": 3.3,
          "vsPierce": 3.1,
          "magic": 2.2,
          "fire": 3.0,
          "ligt": 2.1,
          "holy": 2.3,
          "immunity": 10,
          "robustness": 16,
          "focus": 7,
          "vitality": 8
        },
        {
          "name": "Veteran's Gauntlets",
          "weight": 5.0,
          "available": "Base Game",
          "poise": 9,
          "phy": 4.6,
          "vsStrike": 4.2,
          "vsSlash": 4.8,
          "vsPierce": 4.5,
          "magic": 3.1,
          "fire": 4.0,
          "ligt": 2.8,
          "holy": 3.5,
          "immunity": 15,
          "robustness": 23,
          "focus": 10,
          "vitality": 12
        }
      ],
      "legs": [
        {
          "name": "Blaidd's Greaves",
          "weight": 6.5,
          "available": "Base Game",
          "poise": 15,
          "phy": 7.3,
          "vsStrike": 6.5,
          "vsSlash": 7.6,
          "vsPierce": 7.1,
          "magic": 5.1,
          "fire": 6.8,
          "ligt": 4.9,
          "holy": 5.4,
          "immunity": 24,
          "robustness": 38,
          "focus": 16,
          "vitality": 18
        },
        {
          "name": "Veteran's Greaves",
          "weight": 9.5,
          "available": "Base Game",
          "poise": 22,
          "phy": 10.7,
          "vsStrike": 9.8,
          "vsSlash": 11.3,
          "vsPierce": 10.4,
          "magic": 7.3,
          "fire": 9.5,
          "ligt": 6.7,
          "holy": 8.2,
          "immunity": 36,
          "robustness": 54,
          "focus": 24,
          "vitality": 28
        }
      ]
    }
    ```

## Usage

1. **Build the project:**

    ```bash
    npm run build
    ```

2. **Run the project:**

    ```bash
    npm run start
    ```

3. **Follow the prompts:** The program will ask you for your maximum equip load, current equip load, included armor types, desired roll type, prioritized stats, availability and the number of combinations you want to see.

## License

This project is licensed under the [MIT License](LICENSE).

## Credits

For armor and equip load data: [Elden Ring Fextralife Wiki](https://eldenring.wiki.fextralife.com/)
