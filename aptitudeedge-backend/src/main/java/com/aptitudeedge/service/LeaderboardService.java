package com.aptitudeedge.service;

import com.aptitudeedge.dto.response.LeaderboardEntry;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaderboardService {

    public List<LeaderboardEntry> getLeaderboard() {
        return List.of(
                new LeaderboardEntry("alice", 95),
                new LeaderboardEntry("bob", 88),
                new LeaderboardEntry("carol", 80)
        );
    }
}
