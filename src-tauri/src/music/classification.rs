/// Cardinality-based category names in Chinese
pub fn cardinality_name_zh(n: usize) -> &'static str {
    match n {
        0 => "空集",
        1 => "单音",
        2 => "二音组",
        3 => "三音组",
        4 => "四音组",
        5 => "五音组",
        6 => "六音组",
        7 => "七音组",
        8 => "八音组",
        9 => "九音组",
        10 => "十音组",
        11 => "十一音组",
        12 => "十二音组 (全集)",
        _ => "未知",
    }
}

/// Cardinality-based category names in English
pub fn cardinality_name_en(n: usize) -> &'static str {
    match n {
        0 => "Empty set",
        1 => "Monad",
        2 => "Dyad",
        3 => "Trichord",
        4 => "Tetrachord",
        5 => "Pentachord",
        6 => "Hexachord",
        7 => "Heptachord",
        8 => "Octachord",
        9 => "Nonachord",
        10 => "Decachord",
        11 => "Undecachord",
        12 => "Aggregate (12-tone)",
        _ => "Unknown",
    }
}
