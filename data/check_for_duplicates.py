

import csv
import json


if __name__ == '__main__':
    with open('knowledgebase.csv') as knowledgebase:
        reader = csv.DictReader(knowledgebase)

        content = []
        for line in reader:
            content.append(line);

        print content[0]
        print type(content[0])

        unique_statements = {}
        for item in content:
            stmt = item['Statement']
            if stmt in unique_statements:
                unique_statements[stmt][1].append(item['Emotion'])
                unique_statements[stmt][0].append(item['Category'])
            else:
                unique_statements[stmt] = [[item['Category']],[item['Emotion']]]

        for key, value in unique_statements.items():
            if len(value[1]) > 1:
                print key, value[1]

                categories = value[0]
                mismatch = False
                for item in categories:
                    if item != categories[0]:
                        mismatch = True
                        print categories
                # if not mismatch:
                #     print 'same categories'

            
        
