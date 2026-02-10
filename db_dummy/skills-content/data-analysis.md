# Data Analysis Skill

## Description
This skill enables advanced data analysis capabilities for business intelligence tasks.

## Capabilities

### Data Processing
- Load and parse various data formats (CSV, JSON, Excel)
- Clean and preprocess raw data
- Handle missing values and outliers
- Perform data type conversions

### Statistical Analysis
- Descriptive statistics (mean, median, mode, std dev)
- Correlation analysis
- Hypothesis testing
- Regression analysis
- Time series analysis

## Usage Example

```python
import pandas as pd
from skills import DataAnalysis

data = pd.read_csv("sales_data.csv")
analysis = DataAnalysis.analyze(data)
print(analysis.summary)
```
