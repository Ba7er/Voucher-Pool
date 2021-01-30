
const internals = {
    OBJECTS: {
        CUSTOMER: 'customer',
        VOUCHER: 'voucher',
        RULE_EXPRESSION: 'rule_expression',
        REDEMPTION: 'redemption',
        REDEMPTION_ROLLBACK: 'redemption_rollback',
    },
    VOUCHER: {
        STATUS: {
            ACTIVE: 'active',
            INACTIVE: 'inactive',
            PAUSED: 'paused',
            COMPLETED: 'completed',
        },
        TYPE: {
            DISCOUNT_VOUCHER: 'DISCOUNT_VOUCHER',
            REFUND_VOUCHER: 'REFUND_VOUCHER',
            REFERRAL_VOUCHER: 'REFERRAL_VOUCHER',
        },
        DISCOUNT: {
            PERCENTAGE: 'PERCENTAGE',
            FIXED: 'FIXED',
        },
        CODE_CONFIG: {
            PREFIX: {
                REFERRAL: 'REFERRAL-',
                PROMO: 'PROMO-',
            },
        },
    },
    REDEMPTION: {
        STATUS: {
            REDEEM_SUCCESS: 'REDEEM_SUCCESS',
            REDEEM_FAILED: 'REDEEM_FAILED',
            REDEEM_ROLLBACK_SUCCESS: 'REDEEM_ROLLBACK_SUCCESS',
            REDEEM_ROLLBACK_FAILED: 'REDEEM_ROLLBACK_FAILED',
        },
    },
    REDEMPTION_ROLLBACK: {
        REASON: {
            PARTIAL_CANCELLATION: 'PARTIAL_CANCELLATION',
            FULL_CANCELLATION: 'FULL_CANCELLATION',
        },
        STATUS: {
            CANCELED: 'CANCELED',
        },
    },
    RULE_EXPRESSION: {
        TYPE_ADD_DISCOUNT: 'addDiscount',
    },
    DB_ATTRIBUTES: {
        OBJECT: 'object',
    },
    DEFAULT_PRECISION: 2,
    DAYS: {
        0: 'sun',
        1: 'mon',
        2: 'tue',
        3: 'wed',
        4: 'thu',
        5: 'fri',
        6: 'sat',
    },
};

module.exports = internals;
