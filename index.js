
import { readFileSync, writeFileSync } from 'fs';
import { getInput, setFailed, setOutput } from '@actions/core';
import semver from 'semver';

const file = getInput('file');
const regex = getInput('regex');
const version = getInput('version');


/// run
async function run()
{
    try
    {
        let content = readFileSync(file, 'utf8');
        const versionRegex = /("version"\s*:\s*")[^"]+(")/;
        if (versionRegex.test(content))
        {
            if (semver.valid(version))
            {
                content = content.replace(versionRegex, `$1${version}$2`);
                writeFileSync(file, content, 'utf8');
            }
            else
            {
                setFailed("failed to parse package.json version");
            }
        }
        else
        {
            setFailed("invalid package.json does not contain version");
        }

        // read back
        const pkg2 = JSON.parse(readFileSync(file));
        if (pkg2.version)
        {
            if (semver.valid(pkg2.version))
            {
                setOutput('version', pkg2.version);
            }
            else
            {
                setFailed("failed to parse package.json version");
            }

            if (pkg2.version === version)
            {
                // no issues
            }
            else
            {
                setFailed("readback version different from input version");
            }
        }
        else
        {
            setFailed("invalid package.json does not contain version");
        }
    }
    catch (error)
    {
        setFailed(error.message);
    }
}

run()
