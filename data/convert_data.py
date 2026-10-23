import pandas as pd
import json
import ipaddress
import random

# =========================
# 1. Read Dataset
# =========================

df = pd.read_parquet("cicids_sample.parquet")

print("Dataset loaded successfully!")
print("Total rows:", len(df))


# =========================
# 2. Remove BENIGN Traffic
# =========================
# =========================
# 2. Clean Attack Traffic
# =========================

# Keep attack traffic only
attacks = df[df["Label"] != "BENIGN"].copy()

# Remove records with unspecified IP addresses
attacks = attacks[
    (attacks["Source IP"].astype(str) != "0.0.0.0") &
    (attacks["Destination IP"].astype(str) != "0.0.0.0")
].copy()

print("Clean attack rows:", len(attacks))

# =========================
# 3. Take Samples
# =========================
sample_groups = []

for attack_type, group in attacks.groupby("Label"):

    sample = group.sample(
        n=min(10, len(group)),
        random_state=42
    )

    sample_groups.append(sample)

samples = pd.concat(
    sample_groups,
    ignore_index=True
)

# =========================
# 4. Sentinel X Devices
# =========================

devices = [
    {
        "targetDevice": "PC-094",
        "deviceName": "Security Workstation",
        "employee": "External User"
    },
    {
        "targetDevice": "LAP-022",
        "deviceName": "Finance Laptop",
        "employee": "Sarah Smith"
    },
    {
        "targetDevice": "PC-011",
        "deviceName": "Reception Workstation",
        "employee": "Reception"
    },
    {
        "targetDevice": "SRV-003",
        "deviceName": "Finance Server",
        "employee": "Finance Team"
    },
    {
        "targetDevice": "LAP-015",
        "deviceName": "Network Laptop",
        "employee": "Emma Taylor"
    }
]


# =========================
# 5. Risk Score
# =========================

def calculate_risk(label):

    label = str(label).lower()

    if (
        "sql injection" in label
        or "infiltration" in label
    ):
        return 95

    if (
        "ddos" in label
        or "hulk" in label
    ):
        return 90

    if (
        "brute force" in label
        or "patator" in label
    ):
        return 80

    if (
        "xss" in label
        or "bot" in label
    ):
        return 75

    if (
        "portscan" in label
        or "goldeneye" in label
        or "slowloris" in label
        or "slowhttptest" in label
    ):
        return 70

    return 60


# =========================
# 6. Internal / External
# =========================

# =========================
# 6. Internal / External
# =========================

def get_source_type(ip):

    try:

        address = ipaddress.ip_address(
            str(ip)
        )

        # 0.0.0.0 or other unspecified addresses
        if address.is_unspecified:

            return "Unknown"

        # Private/local IP address
        if address.is_private:

            return "Internal"

        # Public IP address
        return "External"

    except ValueError:

        return "Unknown"


# =========================
# 7. Build Sentinel X Data
# =========================

sentinel_data = []

random.seed(42)


for index, row in samples.iterrows():

    device = random.choice(devices)

    attack_type = (
        str(row["Label"])
        .replace("�", "-")
        .strip()
    )

    record = {

        "id":
            f"DATA-{index + 1:03d}",

        "sourceIp":
            str(row["Source IP"]),

        "destinationIp":
            str(row["Destination IP"]),

        "targetDevice":
            device["targetDevice"],

        "employee":
            device["employee"],

        "deviceName":
            device["deviceName"],

        "sourceType":
            get_source_type(
                row["Source IP"]
            ),

        "attackType":
            attack_type,

        "riskScore":
            calculate_risk(
                attack_type
            )

    }

    sentinel_data.append(record)


# =========================
# 8. Save JSON
# =========================

with open(
    "sentinel_data.json",
    "w",
    encoding="utf-8"
) as file:

    json.dump(
        sentinel_data,
        file,
        indent=4,
        ensure_ascii=False
    )


print(
    "\nSentinel X JSON created successfully!"
)

print(
    "Records created:",
    len(sentinel_data)
)

print(
    "File: sentinel_data.json"
)