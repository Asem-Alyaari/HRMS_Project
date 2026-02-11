-- Insert sample departments and jobs for testing
USE HRMS_Hospital;
GO

-- Check if departments exist, if not insert sample data
IF NOT EXISTS (SELECT 1 FROM HR_CORE.DEPARTMENTS)
BEGIN
    PRINT 'Inserting sample departments...';
    
    INSERT INTO HR_CORE.DEPARTMENTS (DEPT_NAME_AR, DEPT_NAME_EN, DEPT_CODE, IS_ACTIVE)
    VALUES 
        (N'الموارد البشرية', 'Human Resources', 'HR', 1),
        (N'الإدارة المالية', 'Finance', 'FIN', 1),
        (N'تقنية المعلومات', 'Information Technology', 'IT', 1),
        (N'الطوارئ', 'Emergency', 'ER', 1),
        (N'الجراحة', 'Surgery', 'SURG', 1),
        (N'الأشعة', 'Radiology', 'RAD', 1);
    
    PRINT 'Sample departments inserted successfully!';
END
ELSE
BEGIN
    PRINT 'Departments already exist.';
END
GO

-- Check if jobs exist, if not insert sample data
IF NOT EXISTS (SELECT 1 FROM HR_CORE.JOBS)
BEGIN
    PRINT 'Inserting sample jobs...';
    
    INSERT INTO HR_CORE.JOBS (JOB_TITLE_AR, JOB_TITLE_EN, JOB_CODE, IS_ACTIVE)
    VALUES 
        (N'مدير موارد بشرية', 'HR Manager', 'HRM', 1),
        (N'محاسب', 'Accountant', 'ACC', 1),
        (N'مطور برمجيات', 'Software Developer', 'DEV', 1),
        (N'طبيب عام', 'General Practitioner', 'GP', 1),
        (N'ممرض', 'Nurse', 'NRS', 1),
        (N'أخصائي أشعة', 'Radiologist', 'RADL', 1);
    
    PRINT 'Sample jobs inserted successfully!';
END
ELSE
BEGIN
    PRINT 'Jobs already exist.';
END
GO

-- Check if countries exist, if not insert sample data
IF NOT EXISTS (SELECT 1 FROM HR_COMMON.COUNTRIES)
BEGIN
    PRINT 'Inserting sample countries...';
    
    INSERT INTO HR_COMMON.COUNTRIES (COUNTRY_NAME_AR, COUNTRY_NAME_EN, COUNTRY_CODE, IS_ACTIVE)
    VALUES 
        (N'اليمن', 'Yemen', 'YE', 1),
        (N'السعودية', 'Saudi Arabia', 'SA', 1),
        (N'مصر', 'Egypt', 'EG', 1),
        (N'الأردن', 'Jordan', 'JO', 1),
        (N'الإمارات', 'United Arab Emirates', 'AE', 1);
    
    PRINT 'Sample countries inserted successfully!';
END
ELSE
BEGIN
    PRINT 'Countries already exist.';
END
GO

PRINT 'All sample data check completed!';
