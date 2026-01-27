-- Payment Plans table for installment payments
CREATE TABLE IF NOT EXISTS payment_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  bundleId INT NOT NULL,
  totalAmount INT NOT NULL COMMENT 'Total amount in cents',
  monthlyAmount INT NOT NULL COMMENT 'Monthly payment in cents',
  paymentsTotal INT NOT NULL DEFAULT 6 COMMENT 'Total number of payments',
  paymentsCompleted INT NOT NULL DEFAULT 0 COMMENT 'Number of completed payments',
  status ENUM('active', 'completed', 'cancelled', 'failed') NOT NULL DEFAULT 'active',
  startDate DATETIME NOT NULL,
  nextPaymentDate DATETIME NOT NULL,
  stripeCustomerId VARCHAR(255),
  stripePaymentMethodId VARCHAR(255),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_userId (userId),
  INDEX idx_status (status),
  INDEX idx_nextPaymentDate (nextPaymentDate),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (bundleId) REFERENCES course_bundles(id) ON DELETE CASCADE
);

-- Payment Plan Transactions table
CREATE TABLE IF NOT EXISTS payment_plan_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  planId INT NOT NULL,
  amount INT NOT NULL COMMENT 'Payment amount in cents',
  status ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
  paymentDate DATETIME NOT NULL,
  stripePaymentIntentId VARCHAR(255),
  failureReason TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_planId (planId),
  INDEX idx_status (status),
  INDEX idx_paymentDate (paymentDate),
  FOREIGN KEY (planId) REFERENCES payment_plans(id) ON DELETE CASCADE
);
