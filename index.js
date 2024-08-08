
import { readFileSync, writeFileSync } from 'fs';
import { getInput, setFailed, setOutput } from '@actions/core';

const file = getInput('file');
const regex = getInput('regex');
const version = getInput('version');


/// run
async function run()
{
    try
    {
        const pkg = JSON.parse(readFileSync(file));
        if (pkg.version)
        {
            const ver = parse_version(version);
            if (ver)
            {
                pkg.version = version;
                writeFileSync(file, JSON.stringify(pkg, null, '  ') + '\n');
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
            const ver = parse_version(pkg2.version);
            if (ver)
            {
                setOutput('version', pkg2.version);
            }
            else
            {
                setFailed("failed to parse package.json version");
            }

            if (pkg2.version === pkg.version)
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

function parse_version(version)
{
    const match = version.match(regex);
    if (match)
    {
        console.dir({groups: match.groups});
        return [match.groups.major, match.groups.minor, match.groups.patch, match.groups.prerelease, match.groups.buildmetadata];
    }
    return null
}

run()
