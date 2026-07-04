// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {UptimeProtocol} from "../src/UptimeProtocol.sol";

contract DeployUptime is Script {
    function run() external returns (UptimeProtocol) {
        // Retrieve private key from environment or use a default local forge key
        uint256 deployerPrivateKey = vm.envOr("PRIVATE_KEY", uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80));

        vm.startBroadcast(deployerPrivateKey);

        UptimeProtocol uptimeProtocol = new UptimeProtocol();

        vm.stopBroadcast();
        return uptimeProtocol;
    }
}