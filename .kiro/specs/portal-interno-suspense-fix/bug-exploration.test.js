/**
 * Bug Condition Exploration Test
 * 
 * **Validates: Requirements 2.1, 2.2**
 * 
 * Property 1: Bug Condition - Build Process Completes Successfully
 * 
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * 
 * This test verifies that the Next.js build process fails when attempting to
 * prerender the portal-interno page because useSearchParams() is used without
 * a Suspense boundary wrapper.
 * 
 * Expected behavior on UNFIXED code:
 * - Build process fails during static page generation
 * - Error message mentions "useSearchParams() should be wrapped in a suspense boundary"
 * - Error specifically points to the portal-interno page
 * 
 * Expected behavior on FIXED code:
 * - Build process completes successfully
 * - No errors about useSearchParams or Suspense boundaries
 * - Static page is generated correctly
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('='.repeat(80));
console.log('Bug Condition Exploration Test: Portal Interno Suspense Fix');
console.log('='.repeat(80));
console.log('');
console.log('Testing Property 1: Build Process Completes Successfully');
console.log('');
console.log('CRITICAL: This test is EXPECTED TO FAIL on unfixed code.');
console.log('Failure confirms the bug exists and validates our root cause hypothesis.');
console.log('');
console.log('-'.repeat(80));
console.log('');

try {
  console.log('Running: npm run build');
  console.log('');
  
  // Run the build command
  const output = execSync('npm run build', {
    cwd: path.resolve(__dirname, '../../..'),
    encoding: 'utf-8',
    stdio: 'pipe',
    timeout: 120000 // 2 minute timeout
  });
  
  console.log('Build output:');
  console.log(output);
  console.log('');
  console.log('='.repeat(80));
  console.log('✅ BUILD SUCCEEDED');
  console.log('='.repeat(80));
  console.log('');
  console.log('Result: The build completed successfully without errors.');
  console.log('');
  console.log('Interpretation:');
  console.log('- If this is UNFIXED code: UNEXPECTED - The bug may not exist or root cause is incorrect');
  console.log('- If this is FIXED code: EXPECTED - The Suspense wrapper fix resolved the issue');
  console.log('');
  
  process.exit(0);
  
} catch (error) {
  console.log('Build failed with error:');
  console.log('');
  console.log('Exit code:', error.status);
  console.log('');
  console.log('Error output:');
  console.log(error.stderr || error.stdout || error.message);
  console.log('');
  console.log('='.repeat(80));
  console.log('❌ BUILD FAILED');
  console.log('='.repeat(80));
  console.log('');
  
  // Analyze the error to determine if it matches our hypothesis
  const errorOutput = (error.stderr || error.stdout || error.message).toLowerCase();
  
  if (errorOutput.includes('usesearchparams') && errorOutput.includes('suspense')) {
    console.log('✅ COUNTEREXAMPLE FOUND - Bug condition confirmed!');
    console.log('');
    console.log('Analysis:');
    console.log('- Error mentions useSearchParams and Suspense boundary');
    console.log('- This confirms our root cause hypothesis');
    console.log('- The portal-interno page calls useSearchParams() without Suspense wrapper');
    console.log('- Next.js build process fails during static page generation phase');
    console.log('');
    console.log('Documented Counterexample:');
    console.log('- Build Phase: Static page generation (prerendering)');
    console.log('- Page: /portal-interno');
    console.log('- Error Type: Missing Suspense boundary for useSearchParams()');
    console.log('- Expected: This is the CORRECT behavior for unfixed code');
    console.log('');
    console.log('Next Steps:');
    console.log('- Apply the Suspense wrapper fix as described in design.md');
    console.log('- Re-run this test to verify the fix resolves the build failure');
    console.log('');
  } else if (errorOutput.includes('portal-interno')) {
    console.log('⚠️  COUNTEREXAMPLE FOUND - Build fails on portal-interno page');
    console.log('');
    console.log('Analysis:');
    console.log('- Build fails on portal-interno page');
    console.log('- Error may be related to our bug but message differs from hypothesis');
    console.log('- Review the error output above to understand the exact issue');
    console.log('');
  } else {
    console.log('⚠️  BUILD FAILED - But error may not be related to our bug');
    console.log('');
    console.log('Analysis:');
    console.log('- Build failed but error does not mention useSearchParams or Suspense');
    console.log('- This may be a different build issue unrelated to the bug we are fixing');
    console.log('- Review the error output above to determine if it is related');
    console.log('');
  }
  
  console.log('Interpretation:');
  console.log('- If this is UNFIXED code: EXPECTED - The bug exists and causes build failure');
  console.log('- If this is FIXED code: UNEXPECTED - The fix may not be complete or correct');
  console.log('');
  
  // Exit with failure code to indicate test "passed" (found the bug)
  process.exit(1);
}
