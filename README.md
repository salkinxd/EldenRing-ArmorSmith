# Elden Ring Armor Optimizer

This is an Elden Ring armor optimizer tool built with Node.js and TypeScript. It helps you find the best armor combinations in the game based on your desired stats, equip load, roll type, and availability (base game or DLC). The optimizer prioritizes stats in the order you provide and also factors in the "headroom" (remaining equip load) when ranking combinations.

## Installation

1. **Prerequisites:** Make sure you have [Node.js](https://nodejs.org/) and npm installed.
2. **Clone the Repository:**

    ```bash
    git clone https://github.com/salkinxd/EldenRing-ArmorSmith
    ```

3. **Install Dependencies:**

    ```bash
    cd EldenRing-ArmorSmith
    npm install
    ```

4. **Create the `armorData.json` File:**
    * Create a JSON file named `armorData.json` in the root directory of the project.
    * Add all armor data to it, following the structure provided in the example below. You can gather armor data from sources like the [Elden Ring Wiki](https://eldenring.wiki.fextralife.com/Armor).

    **Example `armorData.json`:**

    ```json
    {
        "helms": [
            {
                "name": "Godrick Knight Helm",
                "weight": 5.1,
                "poise": 6,
                "physical": 4.8,
                "vsStrike": 4.2,
                "vsSlash": 5,
                "vsPierce": 4.6,
                "magic": 3.8,
                "fire": 4.6,
                "lightning": 3.6,
                "holy": 4,
                "immunity": 18,
                "robustness": 28,
                "focus": 13,
                "vitality": 13,
                "available": "Base Game"
            }
        ],
        "chests": [
            {
                "name": "Godrick Knight Armor",
                "weight": 11.8,
                "poise": 24,
                "physical": 13.5,
                "vsStrike": 11.9,
                "vsSlash": 14,
                "vsPierce": 12.9,
                "magic": 10.9,
                "fire": 11.9,
                "lightning": 9.5,
                "holy": 10.9,
                "immunity": 35,
                "robustness": 57,
                "focus": 24,
                "vitality": 24,
                "available": "Base Game"
            }
        ],
        "gauntlets": [
            {
                "name": "Godrick Knight Gauntlets",
                "weight": 3.9,
                "poise": 5,
                "physical": 3.2,
                "vsStrike": 2.8,
                "vsSlash": 3.3,
                "vsPierce": 3.1,
                "magic": 2.3,
                "fire": 2.8,
                "lightning": 2.1,
                "holy": 2.3,
                "immunity": 12,
                "robustness": 19,
                "focus": 8,
                "vitality": 8,
                "available": "Base Game"
            }
        ],
        "legs": [
            {
                "name": "Godrick Knight Greaves",
                "weight": 7.4,
                "poise": 13,
                "physical": 7.7,
                "vsStrike": 6.7,
                "vsSlash": 7.9,
                "vsPierce": 7.3,
                "magic": 6.1,
                "fire": 6.9,
                "lightning": 5.8,
                "holy": 6.1,
                "immunity": 24,
                "robustness": 38,
                "focus": 16,
                "vitality": 16,
                "available": "Base Game"
            }
        ]
    }
    ```

## Usage

1. **Build the Project:**

    ```bash
    npm run build
    ```

2. **Run the Project:**

    ```bash
    npm run start
    ```

3. **Follow the Prompts:**

    The program will display an ASCII art title and then ask you a series of questions:

    * Your **maximum equip load**.
    * Your **current equip load** (excluding armor).
    * The **armor types** to include (e.g., `helm`, `chest`, `gauntlets`, `legs`). You can input any combination of these.
    * Your **desired roll type** (`light`, `medium`, or `heavy`).
    * The **stats to prioritize**, in order of importance (e.g., `poise negation resistance`). You can choose from these stats:
        * `poise`
        * `negation` (a composite stat that includes physical, vsStrike, vsSlash, vsPierce, magic, fire, lightning, and holy)
        * `resistance` (a composite stat that includes immunity, robustness, focus, and vitality)
        * `physical`
        * `vsStrike`
        * `vsSlash`
        * `vsPierce`
        * `magic`
        * `fire`
        * `lightning`
        * `holy`
        * `immunity`
        * `robustness`
        * `focus`
        * `vitality`
    * The **number of top combinations** you want to see (1-100).
    * An **availability filter**:
        * `all`: Consider all armor pieces.
        * `Base Game`: Only consider armor available in the base game.
        * `Shadow of the Erdtree DLC`: Only consider armor available in the DLC.

    The program will then output a ranked list of the best armor combinations that meet your criteria. The combinations are sorted by your prioritized stats, with the highest stat values coming first. The "headroom" (remaining equip load) is also considered, with combinations having more headroom being ranked higher if all other stats are equal.

## Testing

The project includes unit tests using Jest. To run the tests:

```bash
npm run test
```

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests on the [GitHub repository](https://github.com/salkinxd/EldenRing-ArmorSmith).

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
