import type { BSchool } from '../types';

export const collegeDatabase: BSchool[] = [
    {
        name: "IIM Ahmedabad (PGP)",
        overallCutoff: { General: 99.0, EWS: 95.0, "OBC-NCL": 95.0, SC: 85.0, ST: 80.0, PwD: 80.0 },
        sectionalCutoffs: {
            General: { VARC: 70, DILR: 70, QA: 70 },
            EWS: { VARC: 65, DILR: 65, QA: 65 },
            "OBC-NCL": { VARC: 65, DILR: 65, QA: 65 },
            SC: { VARC: 60, DILR: 60, QA: 60 },
            ST: { VARC: 50, DILR: 50, QA: 50 },
            PwD: { VARC: 50, DILR: 50, QA: 50 }
        },
        type: "IIM",
        tier: "Tier 1 (Elite)"
    },
    {
        name: "IIM Bangalore (PGP)",
        overallCutoff: { General: 98.5, EWS: 93.0, "OBC-NCL": 93.0, SC: 85.0, ST: 80.0, PwD: 80.0 },
        sectionalCutoffs: {
            General: { VARC: 80, DILR: 75, QA: 75 },
            EWS: { VARC: 72, DILR: 65, QA: 65 },
            "OBC-NCL": { VARC: 72, DILR: 65, QA: 65 },
            SC: { VARC: 65, DILR: 55, QA: 55 },
            ST: { VARC: 55, DILR: 50, QA: 50 },
            PwD: { VARC: 50, DILR: 50, QA: 50 }
        },
        type: "IIM",
        tier: "Tier 1 (Elite)"
    },
    {
        name: "IIM Calcutta (PGP)",
        overallCutoff: { General: 99.3, EWS: 95.0, "OBC-NCL": 95.0, SC: 85.0, ST: 80.0, PwD: 80.0 },
        sectionalCutoffs: {
            General: { VARC: 80, DILR: 80, QA: 80 },
            EWS: { VARC: 75, DILR: 75, QA: 75 },
            "OBC-NCL": { VARC: 75, DILR: 75, QA: 75 },
            SC: { VARC: 65, DILR: 65, QA: 65 },
            ST: { VARC: 55, DILR: 55, QA: 55 },
            PwD: { VARC: 55, DILR: 55, QA: 55 }
        },
        type: "IIM",
        tier: "Tier 1 (Elite)"
    },
    {
        name: "IIM Lucknow (PGP)",
        overallCutoff: { General: 99.0, EWS: 94.0, "OBC-NCL": 94.0, SC: 85.0, ST: 80.0, PwD: 80.0 },
        sectionalCutoffs: {
            General: { VARC: 85, DILR: 85, QA: 85 },
            EWS: { VARC: 77, DILR: 77, QA: 77 },
            "OBC-NCL": { VARC: 77, DILR: 77, QA: 77 },
            SC: { VARC: 55, DILR: 55, QA: 55 },
            ST: { VARC: 50, DILR: 50, QA: 50 },
            PwD: { VARC: 50, DILR: 50, QA: 50 }
        },
        type: "IIM",
        tier: "Tier 1 (Elite)"
    },
    {
        name: "IIM Lucknow (ABM)",
        overallCutoff: { General: 95.0, EWS: 90.0, "OBC-NCL": 90.0, SC: 80.0, ST: 75.0, PwD: 75.0 },
        sectionalCutoffs: {
            General: { VARC: 75, DILR: 75, QA: 75 },
            EWS: { VARC: 70, DILR: 70, QA: 70 },
            "OBC-NCL": { VARC: 70, DILR: 70, QA: 70 },
            SC: { VARC: 50, DILR: 50, QA: 50 },
            ST: { VARC: 45, DILR: 45, QA: 45 },
            PwD: { VARC: 45, DILR: 45, QA: 45 }
        },
        type: "IIM - Specialized",
        tier: "Tier 1",
        reqAgriBio: true
    },
    {
        name: "IIM Kozhikode (PGP)",
        overallCutoff: { General: 98.0, EWS: 90.0, "OBC-NCL": 90.0, SC: 80.0, ST: 75.0, PwD: 75.0 },
        sectionalCutoffs: {
            General: { VARC: 75, DILR: 75, QA: 75 },
            EWS: { VARC: 65, DILR: 65, QA: 65 },
            "OBC-NCL": { VARC: 65, DILR: 65, QA: 65 },
            SC: { VARC: 55, DILR: 55, QA: 55 },
            ST: { VARC: 45, DILR: 45, QA: 45 },
            PwD: { VARC: 45, DILR: 45, QA: 45 }
        },
        type: "IIM",
        tier: "Tier 1"
    },
    {
        name: "IIM Indore (PGP)",
        overallCutoff: { General: 97.0, EWS: 90.0, "OBC-NCL": 90.0, SC: 80.0, ST: 75.0, PwD: 75.0 },
        sectionalCutoffs: {
            General: { VARC: 80, DILR: 80, QA: 80 },
            EWS: { VARC: 70, DILR: 70, QA: 70 },
            "OBC-NCL": { VARC: 70, DILR: 70, QA: 70 },
            SC: { VARC: 55, DILR: 55, QA: 55 },
            ST: { VARC: 45, DILR: 45, QA: 45 },
            PwD: { VARC: 45, DILR: 45, QA: 45 }
        },
        type: "IIM",
        tier: "Tier 1",
        heavyAcads: true
    },
    {
        name: "IIM Mumbai (MBA)",
        overallCutoff: { General: 97.5, EWS: 90.0, "OBC-NCL": 90.0, SC: 82.0, ST: 77.0, PwD: 77.0 },
        sectionalCutoffs: {
            General: { VARC: 75, DILR: 75, QA: 75 },
            EWS: { VARC: 65, DILR: 65, QA: 65 },
            "OBC-NCL": { VARC: 65, DILR: 65, QA: 65 },
            SC: { VARC: 50, DILR: 50, QA: 50 },
            ST: { VARC: 45, DILR: 45, QA: 45 },
            PwD: { VARC: 45, DILR: 45, QA: 45 }
        },
        type: "IIM",
        tier: "Tier 1"
    },
    {
        name: "IIM Mumbai (OSCM)",
        overallCutoff: { General: 97.0, EWS: 90.0, "OBC-NCL": 90.0, SC: 80.0, ST: 75.0, PwD: 75.0 },
        sectionalCutoffs: {
            General: { VARC: 75, DILR: 75, QA: 75 },
            EWS: { VARC: 65, DILR: 65, QA: 65 },
            "OBC-NCL": { VARC: 65, DILR: 65, QA: 65 },
            SC: { VARC: 50, DILR: 50, QA: 50 },
            ST: { VARC: 45, DILR: 45, QA: 45 },
            PwD: { VARC: 45, DILR: 45, QA: 45 }
        },
        type: "IIM - Specialized",
        tier: "Tier 1",
        reqOSCM: true
    },
    {
        name: "VGSoM IIT Kharagpur",
        overallCutoff: { General: 96.0, EWS: 90.0, "OBC-NCL": 90.0, SC: 80.0, ST: 75.0, PwD: 75.0 },
        sectionalCutoffs: {
            General: { VARC: 75, DILR: 75, QA: 75 },
            EWS: { VARC: 65, DILR: 65, QA: 65 },
            "OBC-NCL": { VARC: 65, DILR: 65, QA: 65 },
            SC: { VARC: 50, DILR: 50, QA: 50 },
            ST: { VARC: 45, DILR: 45, QA: 45 },
            PwD: { VARC: 45, DILR: 45, QA: 45 }
        },
        type: "Non-IIM (Elite)",
        tier: "Tier 1",
        reqVgsom: true
    },
    {
        name: "DFS (Delhi University)",
        overallCutoff: { General: 96.5, EWS: 93.0, "OBC-NCL": 93.0, SC: 83.0, ST: 78.0, PwD: 78.0 },
        sectionalCutoffs: {
            General: { VARC: 70, DILR: 70, QA: 70 },
            EWS: { VARC: 60, DILR: 60, QA: 60 },
            "OBC-NCL": { VARC: 60, DILR: 60, QA: 60 },
            SC: { VARC: 50, DILR: 50, QA: 50 },
            ST: { VARC: 45, DILR: 45, QA: 45 },
            PwD: { VARC: 45, DILR: 45, QA: 45 }
        },
        type: "Non-IIM (Elite)",
        tier: "Tier 2",
        reqDfs: true
    },
    {
        name: "IIM Udaipur (CAP)",
        overallCutoff: { General: 92.0, EWS: 77.0, "OBC-NCL": 74.0, SC: 54.0, ST: 40.0, PwD: 40.0 },
        sectionalCutoffs: {
            General: { VARC: 70, DILR: 70, QA: 70 },
            EWS: { VARC: 50, DILR: 50, QA: 50 },
            "OBC-NCL": { VARC: 50, DILR: 50, QA: 50 },
            SC: { VARC: 35, DILR: 35, QA: 35 },
            ST: { VARC: 27, DILR: 27, QA: 27 },
            PwD: { VARC: 27, DILR: 27, QA: 27 }
        },
        type: "IIM - CAP",
        tier: "Tier 2"
    },
    {
        name: "IIM Trichy (CAP)",
        overallCutoff: { General: 92.0, EWS: 77.0, "OBC-NCL": 74.0, SC: 54.0, ST: 40.0, PwD: 40.0 },
        sectionalCutoffs: {
            General: { VARC: 70, DILR: 70, QA: 70 },
            EWS: { VARC: 50, DILR: 50, QA: 50 },
            "OBC-NCL": { VARC: 50, DILR: 50, QA: 50 },
            SC: { VARC: 35, DILR: 35, QA: 35 },
            ST: { VARC: 27, DILR: 27, QA: 27 },
            PwD: { VARC: 27, DILR: 27, QA: 27 }
        },
        type: "IIM - CAP",
        tier: "Tier 2"
    },
    {
        name: "IIM Ranchi (CAP)",
        overallCutoff: { General: 92.0, EWS: 77.0, "OBC-NCL": 74.0, SC: 54.0, ST: 40.0, PwD: 40.0 },
        sectionalCutoffs: {
            General: { VARC: 70, DILR: 70, QA: 70 },
            EWS: { VARC: 50, DILR: 50, QA: 50 },
            "OBC-NCL": { VARC: 50, DILR: 50, QA: 50 },
            SC: { VARC: 35, DILR: 35, QA: 35 },
            ST: { VARC: 27, DILR: 27, QA: 27 },
            PwD: { VARC: 27, DILR: 27, QA: 27 }
        },
        type: "IIM - CAP",
        tier: "Tier 2"
    },
    {
        name: "IIM Raipur (CAP)",
        overallCutoff: { General: 92.0, EWS: 77.0, "OBC-NCL": 74.0, SC: 54.0, ST: 40.0, PwD: 40.0 },
        sectionalCutoffs: {
            General: { VARC: 70, DILR: 70, QA: 70 },
            EWS: { VARC: 50, DILR: 50, QA: 50 },
            "OBC-NCL": { VARC: 50, DILR: 50, QA: 50 },
            SC: { VARC: 35, DILR: 35, QA: 35 },
            ST: { VARC: 27, DILR: 27, QA: 27 },
            PwD: { VARC: 27, DILR: 27, QA: 27 }
        },
        type: "IIM - CAP",
        tier: "Tier 2"
    },
    {
        name: "IIM Kashipur (CAP)",
        overallCutoff: { General: 92.0, EWS: 77.0, "OBC-NCL": 74.0, SC: 54.0, ST: 40.0, PwD: 40.0 },
        sectionalCutoffs: {
            General: { VARC: 70, DILR: 70, QA: 70 },
            EWS: { VARC: 50, DILR: 50, QA: 50 },
            "OBC-NCL": { VARC: 50, DILR: 50, QA: 50 },
            SC: { VARC: 35, DILR: 35, QA: 35 },
            ST: { VARC: 27, DILR: 27, QA: 27 },
            PwD: { VARC: 27, DILR: 27, QA: 27 }
        },
        type: "IIM - CAP",
        tier: "Tier 2"
    }
];
