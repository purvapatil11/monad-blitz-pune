// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {UptimeProtocol} from "../src/UptimeProtocol.sol";

contract UptimeProtocolTest is Test {
    UptimeProtocol public protocol;
    
    address public owner = address(0x1);
    address public reporter = address(0x2);
    address public challenger = address(0x3);
    address public voter1 = address(0x4);
    address public voter2 = address(0x5);

    function setUp() public {
        protocol = new UptimeProtocol();
        
        // Fund our test accounts with some testnet ETH
        vm.deal(owner, 10 ether);
        vm.deal(reporter, 5 ether);
        vm.deal(challenger, 5 ether);
        vm.deal(voter1, 1 ether);
        vm.deal(voter2, 1 ether);
    }

    function test_FullDisputeAndSlashingLoop() public {
        // 1. Owner registers a website with a 1 ETH pool
        vm.prank(owner);
        protocol.registerWebsite{value: 1 ether}("https://aurexstudios.com");
        
        // Verify registration
        (string memory url, address webOwner, uint256 pool, bool active) = protocol.websites(1);
        assertEq(url, "https://aurexstudios.com");
        assertEq(pool, 1 ether);

        // 2. Reporter maliciously reports that the site is DOWN, staking 0.01 ETH
        vm.prank(reporter);
        protocol.reportUptime{value: 0.01 ether}(1, "Asia-South", false);

        // 3. Challenger notices the lie, challenges it, matching the 0.01 ETH stake
        vm.prank(challenger);
        protocol.disputeReport{value: 0.01 ether}(1);

        // 4. Community votes on the dispute (Voters agree the site was actually UP)
        vm.prank(voter1);
        protocol.voteOnDispute(1, true); // true = vote UP

        vm.prank(voter2);
        protocol.voteOnDispute(1, true); // true = vote UP

        // Check balances before settlement
        uint256 reporterBalanceBefore = reporter.balance;
        uint256 challengerBalanceBefore = challenger.balance;

        // 5. Settle the report
        protocol.settleReport(1);

        // 6. Assertions: The reporter lied (said DOWN), community voted UP.
        // Challenger should win the entire combined stake pool (0.02 ETH).
        assertEq(challenger.balance, challengerBalanceBefore + 0.02 ether, "Challenger should get the rewards");
        assertEq(reporter.balance, reporterBalanceBefore, "Reporter should have lost their stake");
        
        // Verify status updated to ResolvedUp
        assertEq(uint(protocol.getReportStatus(1)), uint(UptimeProtocol.ReportStatus.ResolvedUp), "Status should be ResolvedUp");
                
        console.log("Slashing verified! Challenger won the combined pool.");
    }
}
