
import csv
import json


if __name__ == '__main__':
    
    with open('knowledgebase.csv') as knowledgebase:
        reader = csv.DictReader(knowledgebase)
        
        content = []
        for line in reader:
            content.append(line)
        
        print content

        with open('knowledgebase.js', 'w') as output:
            output.write('// global data structure\n')
            output.write('var KNOWLEDGEBASE_DATA = [\n')

            first = True
            for item in content:
                # filter out positive emotions
                if item['Valence'] == 'Positive':
                    continue

                # put comma and newline before each one except the first
                if not first:
                    output.write(',\n');
                first = False

                json.dump(item, output)


            output.write(']\n')
    

