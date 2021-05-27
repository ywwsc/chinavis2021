import pandas as pd
import numpy as np

with open('test.txt', "r") as f:
    str = f.read()
    data = str.split("\n")

    for a in range(0, len(data)):
        data[a] = data[a].replace("[", "").replace("]", "").split(", ")
        data[a] = list(map(int, data[a]))
        # print(type(arr))
    # print(data[1048][2])


df = pd.read_csv('全国/2013/CN-Reanalysis2013010100.csv', index_col=17)
s = [-1]*42249
#print(df.iloc[[2], [16]].values[0][0])
for a in range(0, len(data)):
    for b in range(0, len(data[a])):
        s[data[a][b]] = a
# print(s)

df['class'] = s
print(df)

df.to_csv("00.csv", index=False)
